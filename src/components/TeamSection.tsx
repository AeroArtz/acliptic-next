import Image from "next/image";

type TeamSectionProps = {
  teamName: string;
  description: string;
  teamMembers: string[];
  imageSrc: string;
};

export default function TeamSection({
  teamName,
  description,
  teamMembers,
  imageSrc,
}: TeamSectionProps) {
  return (
    <section className="pt-24 pb-16 mt-16 mb-16">
      <div className="flex flex-row gap-12 justify-center">
        <Image
          src={imageSrc}
          alt={`${teamName} picture`}
          height={240}
          width={350}
          className="rounded-lg"
        />
        <div className="max-w-lg">
          <h2 className="m-0 mb-6 text-3xl leading-9 font-medium">
            {teamName}
          </h2>
          <p className="text-base leading-6 text-black/60">
            {description}
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-12 gap-12">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="text-base leading-6 font-medium"
          >
            {member}
          </div>
        ))}
      </div>
    </section>
  );
}