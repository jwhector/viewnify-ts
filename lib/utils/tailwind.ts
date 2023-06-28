export function classNames(...args: (string | boolean)[]) {
    return args.reduce((prev, cur) => {
        if (typeof cur === "string") return prev + " " + cur;
        return prev;
    }, "") as string;
}