interface PlayModalProps {
    trailerOpen: boolean;
    trailerUrl: string;
    onClose: () => void;
  }
  
  const PlayModal = ({ trailerOpen, trailerUrl, onClose }: PlayModalProps) => {
    if (!trailerOpen) return null; // Don't render unless open
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="relative w-full max-w-3xl aspect-video bg-black rounded-md overflow-hidden">
          <iframe
            src={trailerUrl}
            title="Trailer"
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-2 rounded-md"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };
  
  export default PlayModal;
  