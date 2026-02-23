import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface RatingCircleProps {
  rating: 'green' | 'yellow' | 'red';
}

export default function RatingCircle({ rating }: RatingCircleProps) {
  const config = {
    green: {
      bg: 'bg-rating-green',
      border: 'border-rating-green',
      icon: CheckCircle2,
      label: 'Aligns with Biblical Values',
      glow: 'shadow-[0_0_40px_rgba(34,197,94,0.3)]',
    },
    yellow: {
      bg: 'bg-rating-yellow',
      border: 'border-rating-yellow',
      icon: AlertCircle,
      label: 'Needs Discernment',
      glow: 'shadow-[0_0_40px_rgba(234,179,8,0.3)]',
    },
    red: {
      bg: 'bg-rating-red',
      border: 'border-rating-red',
      icon: XCircle,
      label: 'Conflicts with Biblical Principles',
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.3)]',
    },
  };

  const { bg, border, icon: Icon, label, glow } = config[rating];

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`w-32 h-32 rounded-full ${bg} ${border} border-4 flex items-center justify-center ${glow} transition-all duration-300`}
      >
        <Icon className="w-16 h-16 text-white" strokeWidth={2.5} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Rating
        </p>
        <p className="text-lg font-bold mt-1">{label}</p>
      </div>
    </div>
  );
}
