export const isPendingPaymentOrder = (order) =>
  order?.status === 'pending_payment' && new Date(order.expiresAt || 0).getTime() > Date.now();

export const getPendingPaymentOrders = (orders = []) =>
  orders.filter(isPendingPaymentOrder);

export const formatRemainingTime = (expiresAt, currentTime = Date.now()) => {
  const diff = new Date(expiresAt).getTime() - currentTime;

  if (diff <= 0) {
    return 'Đã hết hạn';
  }

  const totalSeconds = Math.floor(diff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const buildFakeQrMatrix = (seed) => {
  const size = 21;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));

  const drawFinder = (startRow, startCol) => {
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const isOuter = row === 0 || row === 6 || col === 0 || col === 6;
        const isInner = row >= 2 && row <= 4 && col >= 2 && col <= 4;
        matrix[startRow + row][startCol + col] = isOuter || isInner;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 2147483647;
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const inFinderZone =
        (row < 7 && col < 7) ||
        (row < 7 && col >= size - 7) ||
        (row >= size - 7 && col < 7);

      if (inFinderZone) {
        continue;
      }

      hash = (hash * 1103515245 + 12345) % 2147483647;
      matrix[row][col] = hash % 2 === 0;
    }
  }

  return matrix;
};

export const buildPaymentQrDataUri = (order) => {
  const payload = `${order.id}|${order.paymentCode}|${order.totalPrice}`;
  const matrix = buildFakeQrMatrix(payload);
  const cellSize = 8;
  const quietZone = 16;
  const dimension = matrix.length * cellSize + quietZone * 2;
  const rects = [];

  matrix.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) {
        return;
      }

      rects.push(
        `<rect x="${quietZone + colIndex * cellSize}" y="${quietZone + rowIndex * cellSize}" width="${cellSize}" height="${cellSize}" fill="#111827" rx="1" />`
      );
    });
  });

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}">
      <rect width="${dimension}" height="${dimension}" fill="#ffffff" rx="24" />
      ${rects.join('')}
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
