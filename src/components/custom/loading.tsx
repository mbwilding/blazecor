import { Loader2 } from "lucide-react";

const Loading = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Loading {message}...</span>
    </div>
);

export default Loading;
