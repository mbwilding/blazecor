import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    children?: ReactNode;
    top?: boolean;
}

export function Container({ title, children, top = false, className }: ContainerProps) {
    return (
        <Card className={`w-fit h-fit py-3 px-0 bg-secondary ${className ?? ''}`}>
            {top && title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className={`${top ? "" : "flex items-center"}`}>
                {!top && title && <CardTitle className="mr-6">{title}</CardTitle>}
                {children}
            </CardContent>
        </Card>
    );
}

