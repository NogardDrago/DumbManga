export function naturalSort(a: string, b: string): number {
  const ax: (string | number)[] = [];
  const bx: (string | number)[] = [];

  a.replace(/(\d+)|(\D+)/g, (_, num, str) => {
    ax.push(num ? parseInt(num, 10) : str);
    return '';
  });

  b.replace(/(\d+)|(\D+)/g, (_, num, str) => {
    bx.push(num ? parseInt(num, 10) : str);
    return '';
  });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();

    const nn = typeof an === 'number' && typeof bn === 'number' 
      ? an - bn 
      : String(an).localeCompare(String(bn));

    if (nn) return nn;
  }

  return ax.length - bx.length;
}

export function sortFilesByName<T extends { name: string }>(files: T[]): T[] {
  return [...files].sort((a, b) => naturalSort(a.name, b.name));
}

