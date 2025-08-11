import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function AnimatedCommentsDemo() {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Rose Calloway",
      designation: "Product Manager at TechFlow",
      src: "/test77.jpg",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michaelle Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "/test79.jpg",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "/test68.jpg",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "Jennie Kim",
      designation: "Engineering Lead at DataPro",
      src: "/test69.jpg",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Manoban",
      designation: "VP of Technology at FutureNet",
      src: "/test70.jpg",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Jasmine Jaffar",
      designation: "VP of Technology at FutureNet",
      src: "/test71.jpg",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
