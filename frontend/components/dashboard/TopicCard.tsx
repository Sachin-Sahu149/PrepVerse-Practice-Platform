import { ExternalLink } from "lucide-react";

interface TopicCardProps {
    title: string;
    icon: React.ElementType;
    links: string[];
    delay?: number;
}

const TopicCard = ({ title, icon: Icon, links, delay = 0 }: TopicCardProps) => {
    return (
        <div
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 card-shadow transition-all duration-300 hover:card-shadow-hover hover:scale-[1.02] hover:border-primary/30 animate-fade-in"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Watermark icon */}
            <Icon
                size={100}
                className="absolute -bottom-4 -right-4 text-primary/4 transition-all duration-500 group-hover:text-primary/8 group-hover:scale-110"
                strokeWidth={1}
            />

            <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-card-foreground">
                        {title}
                    </h3>
                </div>

                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link}>
                            <a
                                href="#"
                                className="group/link flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <span className="h-1 w-1 shrink-0 rounded-full bg-primary/40 transition-all group-hover/link:bg-primary group-hover/link:scale-125" />
                                <span className="transition-all group-hover/link:translate-x-0.5">{link}</span>
                                <ExternalLink size={12} className="ml-auto opacity-0 transition-opacity group-hover/link:opacity-100" />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TopicCard;
