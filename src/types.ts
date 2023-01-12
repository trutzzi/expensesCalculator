export type GrupedByMerchant = {
    [key: string]: {
        id: number,
        rows: any[];
        tag: string[]
        total?: number;
    }
}
export type GrupedAndProcessed = {
    dataCumparare: string,
    id: number,
    terminal: string,
    tip: string,
    valoare: string
};
export type CSVFormat = {
    C?: string,
    B?: string,
    H?: string,
    Q?: string,
    I?: string,
    R?: string,
    T?: string
};