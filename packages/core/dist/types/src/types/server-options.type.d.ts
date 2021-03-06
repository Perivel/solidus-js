export interface TagData {
    tag: string;
    props: Record<string, unknown>;
}
/**
 * ServerOptions
 *
 * Some configuration options that are passed by the server to the application.
 */
export interface ServerOptions {
    debug: boolean;
    port: number;
    url: string;
    tags: TagData[];
}
