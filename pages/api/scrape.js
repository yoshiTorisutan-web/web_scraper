import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Récupérer le contenu de la page
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // ============ EXTRAIRE LE CSS ============
    let css = "";
    let cssCount = 0;

    // CSS inline dans les balises <style>
    $("style").each((i, elem) => {
      const content = $(elem).html();
      if (content && content.trim()) {
        cssCount++;
        css += `/* ========== Style inline #${cssCount} ========== */\n`;
        css += content.trim() + "\n\n";
      }
    });

    // CSS externe (liens vers fichiers CSS)
    $('link[rel="stylesheet"]').each((i, elem) => {
      const href = $(elem).attr("href");
      if (href) {
        css += `/* Fichier CSS externe: ${href} */\n\n`;
      }
    });

    // ============ EXTRAIRE LE JAVASCRIPT ============
    let js = "";
    let jsInlineCount = 0;
    let jsExternalCount = 0;

    $("script").each((i, elem) => {
      const src = $(elem).attr("src");
      const content = $(elem).html();

      if (src) {
        // Script externe
        jsExternalCount++;
        js += `/* ========== Script externe #${jsExternalCount} ========== */\n`;
        js += `/* Source: ${src} */\n\n`;
      } else if (content && content.trim()) {
        // Script inline
        jsInlineCount++;
        js += `/* ========== Script inline #${jsInlineCount} ========== */\n`;
        js += content.trim() + "\n\n";
      }
    });

    // ============ HTML PROPRE (sans CSS et JS inline) ============
    // Retirer les balises <style> et <script>
    $("style").remove();
    $("script").remove();

    const cleanHtml = $.html();

    // ============ RÉPONSE ============
    res.status(200).json({
      html:
        cleanHtml ||
        "<!DOCTYPE html><html><body><!-- Aucun contenu HTML --></body></html>",
      css: css || "/* Aucun CSS trouvé sur cette page */",
      js: js || "/* Aucun JavaScript trouvé sur cette page */",
      stats: {
        cssInline: cssCount,
        jsInline: jsInlineCount,
        jsExternal: jsExternalCount,
      },
    });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération du contenu",
      details: error.message,
    });
  }
}
