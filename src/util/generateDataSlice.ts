import cloneDeep from 'lodash/cloneDeep';

export default function* generateDataSlice(data: any) {
  const clonedData = cloneDeep(data);
  for (let i = 0; i < clonedData.length; i += 10) {
    const dataSlice = clonedData.slice(i, Math.min(i + 10, clonedData.length));

    if (dataSlice.length > 0) {
      yield dataSlice;
    }
  }
}
