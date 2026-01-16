import geopandas as gpd
gdf = gpd.read_file("data/Chennai_Wards.geojson")
print(gdf.columns)
print(gdf.head(1))
