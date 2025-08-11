import ValueCard from "./ValueCard";

type Value = {
  content: string;
  footer: string;
};

type ValuesSectionProps = {
  title: string;
  values: Value[];
};

export default function ValuesSection({ title, values }: ValuesSectionProps) {
  return (
    <section className="pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 lg:pb-20 mt-10 sm:mt-16 lg:mt-16 mb-10 sm:mb-16 lg:mb-16 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-9 m-0 mb-8 sm:mb-16 lg:mb-32 text-center p-0" 
          style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
        {title}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-16 max-w-[1400px] mx-auto">
        {values.map((value, index) => (
          <ValueCard
            key={index}
            content={value.content}
            footer={value.footer}
          />
        ))}
      </div>
    </section>
  );
}