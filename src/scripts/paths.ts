import path from 'node:path'

const dirname = import.meta.dirname
if (dirname === undefined) throw new Error('`dirname` is undefined')

export const csvPath = path.join(dirname, '../../data/michelin_my_maps.csv')
export const sqlitePath = path.join(dirname, '../../data/michelin.sqlite')
