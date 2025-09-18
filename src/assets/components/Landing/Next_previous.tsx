import { ChevronLeft, ChevronRight } from "lucide-react";

interface NextPreviousProps {
  prevMovie: () => void;
  nextMovie: () => void;
}

const NextPrevious = ({ prevMovie, nextMovie }: NextPreviousProps) => {
  return (
    <>
      <button
        onClick={prevMovie}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      <button
        onClick={nextMovie}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
    </>
  );
};

export default NextPrevious;
