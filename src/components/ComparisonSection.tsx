import Image from "next/image";

type ComparisonData = {
  feature: string;
  SideEffect: string;
  ShortAI: string;
  SubmagicCo: string;
  Munch: string;
  QClipAI: string;
};

type ComparisonSectionProps = {
  title: string;
  data: ComparisonData[];
};

export default function ComparisonSection({
  title,
  data,
}: ComparisonSectionProps) {
  const competitors = [
    "SideEffect",
    "ShortAI",
    "SubmagicCo",
    "Munch",
    "QClipAI",
  ];

  return (
    <section className="pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 lg:pb-20 mt-10 sm:mt-16 lg:mt-16 mb-10 sm:mb-16 lg:mb-16 px-4">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-9 m-0 mb-8 sm:mb-16 lg:mb-36 text-center" 
          style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
        {title}
      </h2>
      <div className="flex justify-center overflow-x-auto">
        <div className="min-w-full sm:min-w-[600px] md:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1200px]">
          <table className="w-full table-auto border-spacing-x-4 sm:border-spacing-x-8 lg:border-spacing-x-20">
            <thead>
              <tr>
                <th className="pb-2 sm:pb-4 text-sm sm:text-base lg:text-lg font-medium text-black sticky left-0 bg-white z-10"></th>
                {competitors.map((competitor) => (
                  <th
                    key={competitor}
                    className="pb-2 sm:pb-4 text-sm sm:text-base lg:text-lg font-medium text-black whitespace-nowrap"
                  >
                    {competitor}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-[#DEDEDE]"
                >
                  <td className="pt-4 sm:pt-6 lg:pt-10 pb-2 sm:pb-4 lg:pb-6 text-sm sm:text-base font-medium text-black sticky left-0 bg-white z-10">
                    {row.feature}
                  </td>
                  {competitors.map((competitor) => (
                    <td
                      key={competitor}
                      className="pt-4 sm:pt-6 lg:pt-10 pb-2 sm:pb-4 lg:pb-6"
                    >
                      <div className="flex justify-center">
                        <Image
                          src={
                            row[
                              competitor as keyof ComparisonData
                            ] === "tick"
                              ? "/tick.svg"
                              : "/cross.svg"
                          }
                          alt={
                            row[
                              competitor as keyof ComparisonData
                            ] === "tick"
                              ? "tick"
                              : "cross"
                          }
                          width={16}
                          height={16}
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}