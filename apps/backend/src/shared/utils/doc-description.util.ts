export function buildMultiLineDocDescription(...description: string[]): string {
  const formattedDes = description.map((des: string, index: number) => {
    if (!des) {
      return;
    }

    const spacing = index !== description.length - 1 ? '\n' : '';

    return `- ${des}` + spacing;
  });

  return formattedDes.join('');
}
