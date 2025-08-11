import Link from "next/link";
import Image from "next/image";

type SourceLinkProps = {
	source: string;
	duration: string;
};

export default function SourceLink({ source, duration }: SourceLinkProps) {
	return (
		<Link
			href="#"
			className="text-[14px] ml-[8.9375rem] mt-[3.8rem] hover:cursor-pointer hover:underline inline-flex items-center"
		>
			<span>
				<strong>Generated From </strong>
				{source} ({duration})
			</span>
			<Image
				src="/LinkArrow.svg"
				alt="link"
				height={10}
				width={10}
				className="ml-[1.25rem]"
			/>
		</Link>
	);
}
