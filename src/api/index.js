import request from "@/utils/request";

// 销量趋势模块
export const getTrendList = () => request({ url: "/trend", method: "GET" });

// 商家销售统计模块
export const getSellerList = () => request({ url: "/seller", method: "GET" });

// 地区销售排行模块
export const getRankList = () => request({ url: "/rank", method: "GET" });

// 库存与销量分析模块
export const getStockList = () => request({ url: "/stock", method: "GET" });

// 热销商品占比模块
export const getHotList = () => request({ url: "/hot", method: "GET" });

// 商家分布模块
export const getMapList = () => request({ url: "/map", method: "GET" });
