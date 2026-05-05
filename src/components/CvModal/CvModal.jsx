import { useEffect, useState, useRef, useCallback } from 'react';
import { X, Download, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import cvPdfBase64 from '../../cv/pdf-data.js';
import './cv-modal.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

function base64ToArrayBuffer(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

const CvModal = ({ isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [scale, setScale] = useState(1.4);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(false);
    setCurrentPage(1);
    setPdf(null);

    const loadPdf = async () => {
      try {
        const data = base64ToArrayBuffer(cvPdfBase64);
        const loadingTask = pdfjsLib.getDocument({
          data,
          isEvalSupported: false,
        });
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        setLoading(false);
      } catch (err) {
        console.error('PDF load error:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadPdf();
  }, [isOpen]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    const renderPage = async () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
      try {
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = { canvasContext: context, viewport };
        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Render error:', err);
        }
      }
    };

    renderPage();
  }, [pdf, currentPage, scale]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrentPage(p => Math.min(p + 1, totalPages));
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setCurrentPage(p => Math.max(p - 1, 1));
    if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + 0.2, 3));
    if (e.key === '-') setScale(s => Math.max(s - 0.2, 0.6));
    if (e.key === 'f' || e.key === 'F') setFullscreen(p => !p);
  }, [onClose, totalPages]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleDownload = () => {
    const buf = base64ToArrayBuffer(cvPdfBase64);
    const blob = new Blob([buf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Adem_Miladi_CV.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.6));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cvm-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={`cvm-shell${fullscreen ? ' cvm-shell--fs' : ''}`}
            initial={{ opacity: 0, scale: 0.93, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div className="cvm-header">
              <div className="cvm-dots">
                <button className="cvm-dot cvm-dot--red" onClick={onClose} aria-label="Close" />
                <span className="cvm-dot cvm-dot--yellow" />
                <span className="cvm-dot cvm-dot--green" />
              </div>
              <span className="cvm-filename">Adem_Miladi_CV.pdf</span>
              <div className="cvm-actions">
                <button className="cvm-btn" onClick={zoomOut} aria-label="Zoom out">−</button>
                <span className="cvm-zoom-label">{Math.round(scale * 100)}%</span>
                <button className="cvm-btn" onClick={zoomIn} aria-label="Zoom in">+</button>
                <button className="cvm-btn" onClick={() => setFullscreen(p => !p)} aria-label="Toggle fullscreen">
                  {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button className="cvm-btn cvm-btn--dl" onClick={handleDownload} aria-label="Download">
                  <Download size={14} />
                  <span>Download</span>
                </button>
                <button className="cvm-btn" onClick={onClose} aria-label="Close"><X size={14} /></button>
              </div>
            </div>

            <div className="cvm-body">
              {loading && !error && (
                <div className="cvm-skeleton">
                  <div className="cvm-sk-header" />
                  <div className="cvm-sk-lines">
                    {[88, 72, 80, 60, 76, 50, 84, 66, 70, 54, 78, 62, 80, 58].map((w, i) => (
                      <div key={i} className="cvm-sk-line" style={{ width: `${w}%`, animationDelay: `${i * 0.07}s` }} />
                    ))}
                  </div>
                  <div className="cvm-sk-footer">
                    <span className="cvm-sk-spinner" />
                    <span className="cvm-sk-text">Rendering CV…</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="cvm-error">
                  <span className="cvm-error__icon">⚠️</span>
                  <p className="cvm-error__title">PDF preview unavailable</p>
                  <p className="cvm-error__sub">Click below to download the CV directly.</p>
                  <button className="cvm-error__btn" onClick={handleDownload}>
                    <Download size={14} /> Download CV
                  </button>
                </div>
              )}

              {!loading && !error && (
                <div className="cvm-canvas-wrap">
                  <canvas ref={canvasRef} className="cvm-canvas" />
                </div>
              )}
            </div>

            {!loading && !error && totalPages > 1 && (
              <div className="cvm-footer">
                <button className="cvm-btn" onClick={prevPage} disabled={currentPage <= 1}>
                  <ChevronLeft size={14} />
                </button>
                <span className="cvm-page-info">{currentPage} / {totalPages}</span>
                <button className="cvm-btn" onClick={nextPage} disabled={currentPage >= totalPages}>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CvModal;
