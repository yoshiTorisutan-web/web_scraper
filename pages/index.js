import { useState, useEffect } from "react";
import {
  Download,
  Globe,
  AlertCircle,
  Loader2,
  Copy,
  Clock,
  Trash2,
} from "lucide-react";

export default function WebScraper() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState(null);
  const [activeTab, setActiveTab] = useState("html");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Charger l'historique au démarrage
  useEffect(() => {
    const savedHistory = localStorage.getItem("scraper-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Sauvegarder l'historique
  const saveToHistory = (url, data) => {
    const newEntry = {
      url,
      timestamp: new Date().toISOString(),
      content: data,
    };

    const updatedHistory = [
      newEntry,
      ...history.filter((h) => h.url !== url),
    ].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem("scraper-history", JSON.stringify(updatedHistory));
  };

  // Supprimer un élément de l'historique
  const deleteFromHistory = (urlToDelete) => {
    const updatedHistory = history.filter((h) => h.url !== urlToDelete);
    setHistory(updatedHistory);
    localStorage.setItem("scraper-history", JSON.stringify(updatedHistory));
  };

  // Charger depuis l'historique
  const loadFromHistory = (entry) => {
    setUrl(entry.url);
    setContent(entry.content);
    setShowHistory(false);
    setActiveTab("html");
  };

  const fetchWebContent = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setContent(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du contenu");
      }

      const data = await response.json();

      // Nettoyer le HTML en retirant les balises <style> et <script>
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.html, "text/html");

      // Supprimer toutes les balises <style>
      doc.querySelectorAll("style").forEach((el) => el.remove());

      // Supprimer toutes les balises <script>
      doc.querySelectorAll("script").forEach((el) => el.remove());

      // Récupérer le HTML nettoyé
      const cleanHtml = doc.documentElement.outerHTML;

      setContent({
        html: cleanHtml,
        css: data.css,
        js: data.js,
      });

      // Sauvegarder dans l'historique
      saveToHistory(url, {
        html: cleanHtml,
        css: data.css,
        js: data.js,
      });

      setActiveTab("html");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (type) => {
    if (!content) return;

    let data;
    switch (type) {
      case "html":
        data = content.html;
        break;
      case "css":
        data = content.css;
        break;
      case "js":
        data = content.js;
        break;
      default:
        return;
    }

    try {
      await navigator.clipboard.writeText(data);
      alert("Copié dans le presse-papier !");
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  const downloadContent = (type) => {
    if (!content) return;

    let data, filename, mimeType;

    switch (type) {
      case "html":
        data = content.html;
        filename = "page.html";
        mimeType = "text/html";
        break;
      case "css":
        data = content.css;
        filename = "styles.css";
        mimeType = "text/css";
        break;
      case "js":
        data = content.js;
        filename = "scripts.js";
        mimeType = "text/javascript";
        break;
      default:
        return;
    }

    const blob = new Blob([data], { type: mimeType });
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWebContent();
    }
  };

  const tabs = [
    { id: "html", label: "HTML", icon: "📄" },
    { id: "css", label: "CSS", icon: "🎨" },
    { id: "js", label: "JavaScript", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Globe className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Web Content Scraper
          </h1>
          <p className="text-gray-600">
            Récupérez le HTML, CSS et JavaScript de la page web
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-800"
              />

              {/* Bouton Historique */}
              {history.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600 transition"
                  title="Historique"
                >
                  <Clock className="w-5 h-5" />
                </button>
              )}

              {/* Menu déroulant historique */}
              {showHistory && history.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-700 text-sm">
                      Historique récent
                    </h3>
                  </div>
                  {history.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <button
                        onClick={() => loadFromHistory(entry)}
                        className="flex-1 text-left"
                      >
                        <div className="text-sm text-gray-800 truncate">
                          {entry.url}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(entry.timestamp).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFromHistory(entry.url);
                        }}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={fetchWebContent}
              disabled={loading || !url}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Analyser"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Content Display */}
        {content && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  {activeTab === "html" && `${content.html.length} caractères`}
                  {activeTab === "css" && `${content.css.length} caractères`}
                  {activeTab === "js" && `${content.js.length} caractères`}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(activeTab)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition"
                  >
                    <Copy className="w-4 h-4" />
                    Copier
                  </button>
                  <button
                    onClick={() => downloadContent(activeTab)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-sm text-green-400 font-mono">
                  {activeTab === "html" && content.html}
                  {activeTab === "css" && content.css}
                  {activeTab === "js" && content.js}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Astuce :</strong> Testez avec des sites comme
            https://example.com ou https://github.com pour voir les résultats.
          </p>
        </div>
      </div>
    </div>
  );
}
