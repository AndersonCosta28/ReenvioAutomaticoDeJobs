import { Params } from "./Job/Job.commom";

export const addDays = (date: Date, days: number) => {
    const dat = new Date(date.getTime())
    dat.setDate(dat.getDate() + days)
    return dat;
}

export const pastDays = (currentDate: Date, numberDays: number) => {
    const d = new Date()
    d.setDate(currentDate.getDate() - numberDays)
    return d
}

export const numberBetweenDays = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
}

export const splitDayInterval = (startDate: Date, endDate: Date, numberSplit: number) => {
    const numberOfDays: number = numberBetweenDays(startDate, endDate)
    const listOfDays: Params[] = []

    if (numberSplit === 0) {
        listOfDays.push({ startDate: startDate.toLocaleDateString("zh-Hans-CN").split("/").join("-"), endDate: startDate.toLocaleDateString("zh-Hans-CN").split("/").join("-") })
        return listOfDays
    }

    if (numberOfDays < numberSplit)
        throw new Error("A divisão não pode ser maior do que a quantidade de dias disponíveis")

    let nextDate = startDate;
    let reamingDays = numberOfDays
    do {
        let beforeSubtract = reamingDays
        reamingDays -= numberSplit
        const ed = addDays(nextDate, reamingDays <= 0 ? beforeSubtract : numberSplit)
        listOfDays.push({ startDate: nextDate.toLocaleDateString("zh-Hans-CN").split("/").join("-"), endDate: ed.toLocaleDateString("zh-Hans-CN").split("/").join("-")})
        nextDate = addDays(ed, 1)

        if (reamingDays <= 0) break;
    } while (true)
    return listOfDays
}