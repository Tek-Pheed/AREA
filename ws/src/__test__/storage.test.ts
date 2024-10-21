import { setItem, createVariable, readValue } from '../utils/storage';
import fs from 'fs';

jest.mock('fs');

describe('Storage Utility Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should set an item in storage', async () => {
        const mockStorage = {};
        jest.spyOn(fs, 'readFileSync').mockReturnValue(
            JSON.stringify(mockStorage)
        );
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
        await setItem('testKey', 'testParam', 'testValue');

        expect(fs.readFileSync).toHaveBeenCalledWith('storage.json', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            'storage.json',
            JSON.stringify({
                testKey: { testParam: 'testValue' },
            })
        );
    });

    it('should create a variable in storage if it does not exist', async () => {
        const mockStorage = {};
        jest.spyOn(fs, 'readFileSync').mockReturnValue(
            JSON.stringify(mockStorage)
        );
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

        const result = await createVariable('newKey');

        expect(fs.readFileSync).toHaveBeenCalledWith('storage.json', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            'storage.json',
            JSON.stringify({ newKey: {} })
        );
        expect(result).toEqual({});
    });

    it('should read a value from storage', async () => {
        const mockStorage = { existingKey: { param: 'value' } };
        jest.spyOn(fs, 'readFileSync').mockReturnValue(
            JSON.stringify(mockStorage)
        );

        const result = await readValue('existingKey');

        expect(fs.readFileSync).toHaveBeenCalledWith('storage.json', 'utf8');
        expect(result).toEqual({ param: 'value' });
    });
});
