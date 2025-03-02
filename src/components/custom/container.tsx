import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface ContainerProps {
    title?: string;
    children?: ReactNode;
    top?: boolean;
}

export function Container({ title, children, top = false }: ContainerProps) {
    return (
        <Card className="w-fit h-fit">
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
