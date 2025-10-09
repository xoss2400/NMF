import React from "react";

export default function HorizontalScroller({ title, subtitle, items = [], renderItem, itemWidth = "w-40", gap = "gap-6" }: any) {
  return (
    <section className="mb-12">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`flex ${gap} overflow-x-auto pb-4 snap-x snap-mandatory`}> 
        {items.map((item: any, index: number) => (
          <div key={item.id || index} className={`flex-shrink-0 ${itemWidth} snap-center`}>{renderItem(item)}</div>
        ))}
      </div>
    </section>
  );
}
