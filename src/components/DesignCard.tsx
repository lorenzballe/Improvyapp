import React from "react";
import * as Lucide from "lucide-react";

interface DesignCardProps {
  title: string;
  subtitle: string;
  description: string;
  number: string;
  iconName: keyof typeof Lucide;
}

export function DesignCard({
  title,
  subtitle,
  description,
  number,
  iconName,
}: DesignCardProps) {
  // Dynamically resolve icon from Key name
  const IconComponent = Lucide[iconName] as React.ComponentType<any>;

  return (
    <div className="card-wrapper select-none">
      <div className="card cursor-pointer group">
        <div className="card-info">
          {/* Top section: Number and Icon */}
          <div className="w-full flex justify-between items-start">
            <span className="font-sans font-semibold text-xs tracking-widest text-[#ea5358]/80 group-hover:text-[#f7ba2b] transition-colors duration-500">
              //{number}
            </span>
            {IconComponent && (
              <IconComponent className="w-6 h-6 text-white/40 group-hover:text-[#f7ba2b] group-hover:scale-110 duration-500 ease-out" />
            )}
          </div>

          {/* Bottom section: Title and subtitle */}
          <div className="w-full mt-auto flex flex-col gap-1.5 self-strech">
            <h4 className="title text-xs uppercase tracking-widest text-white/50 group-hover:text-[#f7ba2b] transition-colors">
              {title}
            </h4>
            <h3 className="font-display text-lg font-bold text-white tracking-tight -mt-0.5 leading-tight group-hover:text-white transition-colors">
              {subtitle}
            </h3>
            <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
