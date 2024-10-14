import fs from 'fs';

export async function setItem(key: string, param: string, value: any) {
    const storage = JSON.parse(fs.readFileSync('storage.json', 'utf8'));

    if (!storage[key]) storage[key] = {};
    storage[key][`${param}`] = value;
    fs.writeFileSync('storage.json', JSON.stringify(storage));
}

export async function createVariable(key: string) {
    const storage = JSON.parse(fs.readFileSync('storage.json', 'utf8'));

    if (!storage[key]) {
        storage[key] = {};
        fs.writeFileSync('storage.json', JSON.stringify(storage));
    }
}
