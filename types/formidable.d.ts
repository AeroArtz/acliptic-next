declare module "formidable" {
    import * as http from "http";

    interface Files {
        [fieldname: string]: File[];
    }

    interface File {
        originalFilename?: string;
        filepath: string;
        mimetype?: string;
        size: number;
    }

    interface Fields {
        [fieldname: string]: string | string[];
    }

    interface FormidableOptions {
        uploadDir?: string;
        keepExtensions?: boolean;
        maxFileSize?: number;
        filter?: (part: { mimetype?: string; originalFilename?: string }) => boolean;
    }

    class IncomingForm {
        constructor(options?: FormidableOptions);
        parse(
            req: http.IncomingMessage,
            callback: (err: Error | null, fields: Fields, files: Files) => void
        ): void;
    }

    export default IncomingForm;
}
