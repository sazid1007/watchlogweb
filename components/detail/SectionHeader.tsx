interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
  );
}
