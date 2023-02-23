class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getCenterByPoint(otherP) { // 取得兩點中心座標
    return new Point((this.x + otherP.x) / 2, (this.y + otherP.y) / 2);
  }
  getSqrtLenByPoint(otherP) { // 取得兩點直線長度
    return Math.sqrt(((this.x - otherP.x) ** 2) + ((this.y - otherP.y) ** 2));
  }
  getDegreeByPoint(otherP) { // 取得斜邊和對邊的角度
    const y = otherP.y - this.y,
      x = otherP.x - this.x;

    return Math.atan2(y, x) * 180 / Math.PI;
  }
  subtract(otherP) {
    return new Point(this.x - otherP.x, this.y - otherP.y);
  }

  // getDirection(otherP) { // 計算正轉or反轉
  //   return this.x * otherP.y - otherP.x * this.y > 0 ? -1 : 1;
  // }
  // dot(otherP) { // 計算向量積
  //   return this.x * otherP.x + this.y * otherP.y;
  // }
  // getAngle(otherP) {
  //   mr = this.getSqrtLenByPoint(otherP);
  //   if (mr === 0) return 0;

  //   let r = this.dot(otherP) / mr;
  //   if (r > 1) r = 1;

  //   return Math.acos(r)
  // }
  // getRotateAngle(otherP) {
  //   const angle = this.getAngle(otherP);
  //   if (this.getDirection(otherP) > 0) angle *= -1;
  //   return angle * 180 / Math.PI;
  // }
}

export default Point;