const exercisesData = [
    {
        "id": 1,
        "category": "SQL",
        "statement": "Mostrar el código, razón social de todos los clientes cuyo límite de crédito sea mayor o igual a $ 1000 ordenado por código de cliente.",
        "solution": "select clie_codigo, clie_razon_social\nfrom Cliente\nwhere clie_limite_credito >= 1000;",
        "entities": [
            "Cliente"
        ]
    },
    {
        "id": 2,
        "category": "SQL",
        "statement": "Mostrar el código, detalle de todos los artículos vendidos en el año 2012 ordenados por cantidad vendida.",
        "solution": "select item_producto as codigo, P.prod_detalle\nfrom Item_Factura\nJOIN Producto P on item_producto = prod_codigo\ngroup by item_producto, P.prod_detalle\norder by sum(item_cantidad);",
        "entities": [
            "Item_factura",
            "Producto"
        ]
    },
    {
        "id": 3,
        "category": "SQL",
        "statement": "Realizar una consulta que muestre código de producto, nombre de producto y el stock total, sin importar en que deposito se encuentre, los datos deben ser ordenados por nombre del artículo de menor a mayor.",
        "solution": "select prod_codigo, prod_detalle, sum(S.stoc_cantidad) as stock_total\nfrom Producto\njoin STOCK S on prod_codigo = stoc_producto\ngroup by prod_codigo, prod_detalle\norder by prod_detalle;",
        "entities": [
            "Producto",
            "Stock"
        ]
    },
    {
        "id": 4,
        "category": "SQL",
        "statement": "Realizar una consulta que muestre para todos los artículos código, detalle y cantidad de artículos que lo componen. Mostrar solo aquellos artículos para los cuales el stock promedio por depósito sea mayor a 100.",
        "solution": "select prod_codigo, prod_detalle, count(C.comp_componente) as cant_componente\nfrom Producto\njoin Composicion C on prod_codigo = comp_producto\njoin STOCK S on prod_codigo = stoc_producto\ngroup by prod_codigo, prod_detalle\nhaving avg(S.stoc_cantidad) > 100;",
        "entities": [
            "Producto",
            "Composicion",
            "Stock"
        ]
    },
    {
        "id": 5,
        "category": "SQL",
        "statement": "Realizar una consulta que muestre código de artículo, detalle y cantidad de egresos de stock que se realizaron para ese artículo en el año 2012 (egresan los productos que fueron vendidos). Mostrar solo aquellos que hayan tenido más egresos que en el 2011.",
        "solution": "select prod_codigo, prod_detalle, sum(I.item_cantidad) as Cantidad\nfrom Producto\njoin Item_Factura I on prod_codigo = item_producto\njoin Factura F on item_numero = fact_numero\ngroup by prod_codigo, prod_detalle, year(F.fact_fecha)\nhaving \n  sum(case when year(fact_fecha) = 2012 then I.item_cantidad else 0 end)\n  > sum(case when year(fact_fecha) = 2011 then I.item_cantidad else 0 end)\n\n-- Solución Alternativa:\nSELECT\n  p1.prod_codigo,\n  p1.prod_detalle,\n  SUM(i1.item_cantidad) AS cantidad_egresos\nFROM Producto p1\nINNER JOIN Item_Factura i1\nON p1.prod_codigo = i1.item_producto\nINNER JOIN Factura f1\nON f1.fact_numero = i1.item_numero AND\n  f1.fact_sucursal = i1.item_sucursal AND\n  f1.fact_tipo = i1.item_tipo\nWHERE YEAR(f1.fact_fecha) = 2012\nGROUP BY\n  p1.prod_codigo,\n  p1.prod_detalle\nHAVING\n  (\n    SELECT\n      SUM(i2.item_cantidad) AS cantidad_egresos\n    FROM Item_Factura i2\n    INNER JOIN Factura f2\n    ON f2.fact_numero = i2.item_numero AND\n      f2.fact_sucursal = i2.item_sucursal AND\n      f2.fact_tipo = i2.item_tipo\n    WHERE YEAR(f2.fact_fecha) = 2011 AND i2.item_producto = p1.prod_codigo\n  ) < SUM(i1.item_cantidad)",
        "entities": [
            "Producto",
            "Item_factura",
            "Factura"
        ]
    },
    {
        "id": 6,
        "category": "SQL",
        "statement": "Mostrar para todos los rubros de artículos código, detalle, cantidad de artículos de ese rubro y stock total de ese rubro de artículos. Solo tener en cuenta aquellos artículos que tengan un stock mayor al del artículo '00000000' en el depósito '00'.",
        "solution": "select rubr_id, rubr_detalle , count(P.prod_codigo) as cant_prodcutos, sum(S.stoc_cantidad) as stock\nfrom Rubro\njoin Producto P on rubr_id = prod_rubro\njoin STOCK S on S.stoc_producto = p.prod_codigo\nwhere S.stoc_cantidad > \n(select stoc_cantidad from stock where stoc_producto = '00000000' and stoc_deposito = '00')\ngroup by rubr_id, rubr_detalle",
        "entities": [
            "Rubro",
            "Producto",
            "Stock"
        ]
    },
    {
        "id": 7,
        "category": "SQL",
        "statement": "Generar una consulta que muestre para cada artículo código, detalle, mayor precio menor precio y % de la diferencia de precios (respecto del menor Ej.: menor precio = 10, mayor precio =12 => mostrar 20 %). Mostrar solo aquellos artículos que posean stock.",
        "solution": "select prod_detalle, min(item_precio) as min_precio, max(item_precio) as max_precio, ((max(item_precio)-min(item_precio))/min(item_precio))*100 as diferencia\nfrom Producto\njoin Item_Factura on prod_codigo = item_producto\nWHERE EXISTS (\n  SELECT 1 FROM STOCK s WHERE s.stoc_producto = prod_codigo GROUP BY s.stoc_producto HAVING SUM(s.stoc_cantidad) > 0\n)\ngroup by prod_codigo, prod_detalle",
        "entities": [
            "Producto",
            "Item_factura",
            "Stock"
        ]
    },
    {
        "id": 8,
        "category": "SQL",
        "statement": "Mostrar para el o los artículos que tengan stock en todos los depósitos, nombre del artículo, stock del depósito que más stock tiene.",
        "solution": "select prod_detalle, max(stoc_cantidad)\nfrom Producto\njoin stock on stoc_producto = prod_codigo\ngroup by prod_codigo, prod_detalle\nhaving count(stoc_deposito) = (select count (*) from DEPOSITO);",
        "entities": [
            "Producto",
            "Stock",
            "Deposito"
        ]
    },
    {
        "id": 9,
        "category": "SQL",
        "statement": "Mostrar el código del jefe, código del empleado que lo tiene como jefe, nombre del mismo y la cantidad de depósitos que ambos tienen asignados.",
        "solution": "Select E2.empl_nombre as jefe, E2.empl_codigo as jefe, E.empl_nombre, E.empl_codigo,\n((select count(*) from DEPOSITO D where D.depo_encargado = E.empl_codigo) +\n(select count(*) from DEPOSITO D1 where D1.depo_encargado = E2.empl_codigo))\nfrom Empleado E\nJOIN Empleado E2 on E.empl_jefe = E2.empl_codigo\ngroup by E.empl_codigo, E2.empl_nombre, E2.empl_codigo, E.empl_nombre",
        "entities": [
            "Deposito",
            "Empleado"
        ]
    },
    {
        "id": 10,
        "category": "SQL",
        "statement": "Mostrar los 10 productos más vendidos en la historia y también los 10 productos menos vendidos en la historia. Además mostrar de esos productos, quien fue el cliente que mayor compra realizo.",
        "solution": "WITH menos_vendidos as (SELECT TOP 10 prod_codigo, prod_detalle, sum(item_cantidad) as cantidad_comprada from Producto left join Item_Factura on prod_codigo = item_producto group by prod_codigo, prod_detalle order by sum(item_cantidad) asc),\nmas_vendidos as (SELECT TOP 10 prod_codigo, prod_detalle, sum(item_cantidad)as cantidad_comprada from Producto join Item_Factura on prod_codigo = item_producto group by prod_codigo, prod_detalle order by sum(item_cantidad) desc ),\nlista_unida as (Select prod_codigo, prod_detalle, cantidad_comprada from menos_vendidos union Select prod_codigo, prod_detalle, cantidad_comprada from mas_vendidos)\nSelect prod_codigo, prod_detalle, cantidad_comprada,\n(select TOP 1 fact_cliente from Factura join Item_Factura on fact_numero = item_numero and fact_sucursal = item_sucursal where item_producto = prod_codigo group by fact_cliente order by sum(item_cantidad) desc)\nfrom lista_unida\n\n--- Solución sin with\n-- 1. Crear tabla temporal para guardar los resultados\nCREATE TABLE #RankingProductos (\n    prod_codigo CHAR(6), -- Ajusta según tu tipo de dato\n    prod_detalle CHAR(100),\n    cantidad_comprada DECIMAL(12,2)\n)\n\n-- 2. Insertar los 10 menos vendidos\nINSERT INTO #RankingProductos\nSELECT TOP 10 p.prod_codigo, p.prod_detalle, ISNULL(SUM(i.item_cantidad), 0)\nFROM Producto p\nLEFT JOIN Item_Factura i ON p.prod_codigo = i.item_producto\nGROUP BY p.prod_codigo, p.prod_detalle\nORDER BY SUM(i.item_cantidad) ASC\n\n-- 3. Insertar los 10 más vendidos (usando UNION o un segundo INSERT)\nINSERT INTO #RankingProductos\nSELECT TOP 10 p.prod_codigo, p.prod_detalle, SUM(i.item_cantidad)\nFROM Producto p\nJOIN Item_Factura i ON p.prod_codigo = i.item_producto\nGROUP BY p.prod_codigo, p.prod_detalle\nORDER BY SUM(i.item_cantidad) DESC\n\n-- 4. Consulta final consultando la tabla temporal\nSELECT \n    prod_codigo, \n    prod_detalle, \n    cantidad_comprada,\n    (SELECT TOP 1 f.fact_cliente \n     FROM Factura f \n     JOIN Item_Factura i ON f.fact_numero = i.item_numero \n                         AND f.fact_sucursal = i.item_sucursal \n                         AND f.fact_tipo = i.item_tipo\n     WHERE i.item_producto = #RankingProductos.prod_codigo \n     GROUP BY f.fact_cliente \n     ORDER BY SUM(i.item_cantidad) DESC) AS cliente_mayor_compra\nFROM #RankingProductos\n\n-- 5. Limpieza\nDROP TABLE #RankingProductos",
        "entities": [
            "Producto",
            "Item_factura",
            "Menos_vendidos",
            "Mas_vendidos",
            "Factura",
            "Lista_unida"
        ]
    },
    {
        "id": 11,
        "category": "SQL",
        "statement": "Realizar una consulta que retorne el detalle de la familia, la cantidad diferentes de productos vendidos y el monto de dichas ventas sin impuestos. Los datos se deberán ordenar de mayor a menor, por la familia que más productos diferentes vendidos tenga, solo se deberán mostrar las familias que tengan una venta superior a 20000 pesos para el año 2012.",
        "solution": "SELECT f.fami_id AS cod_familia, f.fami_detalle AS detalle_familia, count (distinct p.prod_codigo) as cantidad_productos, sum(ifa.item_precio*item_cantidad) as facturado\nfrom Familia f\njoin Producto p on p.prod_familia = f.fami_id\njoin Item_Factura ifa on p.prod_codigo = ifa.item_producto\njoin Factura fa on fa.fact_numero = ifa.item_numero and fa.fact_sucursal = ifa.item_sucursal and fa.fact_tipo = ifa.item_tipo\ngroup by f.fami_detalle, f.fami_id\nhaving sum(case when year(fa.fact_fecha) = 2012 then ifa.item_precio*item_cantidad else 0 end) > 20000\norder by cantidad_productos;\n\n-- Esta solución, muestra los totale de productos y montos SOLO del 2012. Filtra con where\nSELECT \n    f.fami_id AS cod_familia,\n    f.fami_detalle AS detalle_familia,\n    count (distinct p.prod_codigo) as cantidad_productos,\n    sum(ifa.item_precio*item_cantidad) as facturado\nfrom Familia f\njoin Producto p on p.prod_familia = f.fami_id\njoin Item_Factura ifa on p.prod_codigo = ifa.item_producto\njoin Factura fa on fa.fact_numero = ifa.item_numero\nand fa.fact_sucursal = ifa.item_sucursal and fa.fact_tipo = ifa.item_tipo\nwhere year(fact_fecha) = 2012\ngroup by f.fami_detalle, f.fami_id\nhaving sum(ifa.item_precio*item_cantidad)  > 20000\norder by cantidad_productos;",
        "entities": [
            "Familia",
            "Producto",
            "Item_factura",
            "Factura"
        ]
    },
    {
        "id": 12,
        "category": "SQL",
        "statement": "Mostrar nombre de producto, cantidad de clientes distintos que lo compraron importe promedio pagado por el producto, cantidad de depósitos en los cuales hay stock del producto y stock actual del producto en todos los depósitos. Se deberán mostrar aquellos productos que hayan tenido operaciones en el año 2012 y los datos deberán ordenarse de mayor a menor por monto vendido del producto.",
        "solution": "Select prod_detalle, count (distinct fact_cliente) as clientes_que_compraron, avg(item_precio) as precio_promedio,\n(Select count (*) from STOCK s where s.stoc_producto = prod_codigo and s.stoc_cantidad > 0 ) as cantidad_depositos,\n(select sum(s.stoc_cantidad) from STOCK s where s.stoc_producto = prod_codigo) as stock_actual_total\nfrom Producto\njoin Item_Factura on prod_codigo = item_producto\njoin Factura on item_numero = fact_numero and item_tipo = fact_tipo and item_sucursal = fact_sucursal\nwhere prod_codigo in (\n  select p.item_producto from Item_Factura p\n  join Factura fa on p.item_numero = fa.fact_numero and p.item_tipo = fa.fact_tipo and p.item_sucursal = fa.fact_sucursal\n  where year(fa.fact_fecha)= 2012\n)\ngroup by prod_detalle, prod_codigo\norder by sum(item_precio*item_cantidad) desc",
        "entities": [
            "Stock",
            "Producto",
            "Item_factura",
            "Factura"
        ]
    },
    {
        "id": 13,
        "category": "SQL",
        "statement": "Realizar una consulta que retorne para cada producto que posea composición nombre del producto, precio del producto, precio de la sumatoria de los precios por la cantidad de los productos que lo componen. Solo se deberán mostrar los productos que estén compuestos por más de 2 productos y deben ser ordenados de mayor a menor por cantidad de productos que lo componen.",
        "solution": "Select P1.prod_detalle, P1.prod_precio, sum(P2.prod_precio*comp_cantidad) as precipo_componentes, sum(comp_cantidad) as cant_total_componentes\nfrom Composicion\njoin Producto P1 on P1.prod_codigo = comp_producto\njoin Producto P2 on P2.prod_codigo = comp_componente\ngroup by P1.prod_detalle, P1.prod_precio, P1.prod_codigo\nhaving sum(comp_cantidad) > 2\norder by sum(comp_cantidad) desc;",
        "entities": [
            "Composicion",
            "Producto"
        ]
    },
    {
        "id": 14,
        "category": "SQL",
        "statement": "Escriba una consulta que retorne una estadística de ventas por cliente. Los campos que debe retornar son: Código del cliente, Cantidad de veces que compro en el último año, Promedio por compra en el último año, Cantidad de productos diferentes que compro en el último año, Monto de la mayor compra que realizo en el último año.",
        "solution": "SELECT c.clie_codigo AS codigo_cliente,\nISNULL(COUNT(DISTINCT f.fact_numero + f.fact_tipo + f.fact_sucursal), 0) AS cant_veces,\nISNULL(AVG(f.fact_total), 0) AS promedio_importe,\nISNULL(( SELECT COUNT(DISTINCT sub_if.item_producto) FROM Item_Factura sub_if JOIN Factura sub_f ON sub_if.item_numero = sub_f.fact_numero AND sub_if.item_tipo = sub_f.fact_tipo AND sub_if.item_sucursal = sub_f.fact_sucursal WHERE sub_f.fact_cliente = c.clie_codigo AND YEAR(sub_f.fact_fecha) = (SELECT MAX(YEAR(fact_fecha)) FROM Factura) ), 0) AS productos_distintos,\nISNULL(MAX(f.fact_total), 0) AS max_compra\nFROM Cliente c\nLEFT JOIN Factura f ON c.clie_codigo = f.fact_cliente AND YEAR(f.fact_fecha) = (SELECT MAX(YEAR(fact_fecha)) FROM Factura)\nGROUP BY c.clie_codigo\nORDER BY cant_veces DESC;",
        "entities": [
            "Item_factura",
            "Factura",
            "Cliente"
        ]
    },
    {
        "id": 15,
        "category": "SQL",
        "statement": "Escriba una consulta que retorne los pares de productos que hayan sido vendidos juntos (en la misma factura) más de 500 veces. El resultado debe mostrar el código y descripción de cada uno de los productos y la cantidad de veces que fueron vendidos juntos.",
        "solution": "Select I1.item_producto, P1.prod_detalle, I2.item_producto, P2.prod_detalle, count (*) as total\nfrom Item_Factura I1\njoin Item_Factura I2 on I1.item_numero = I2.item_numero and I1.item_sucursal = I2.item_sucursal and I1.item_tipo = I2.item_tipo\njoin Producto P1 on I1.item_producto = P1.prod_codigo\njoin Producto P2 on I2.item_producto = P2.prod_codigo\nwhere I1.item_numero = I2.item_numero and I1.item_producto > I2.item_producto\ngroup by I1.item_producto, I2.item_producto, P1.prod_detalle,P2.prod_detalle\nhaving count (*) > 500\norder by count (*) desc",
        "entities": [
            "Item_factura",
            "Producto"
        ]
    },
    {
        "id": 16,
        "category": "SQL",
        "statement": "Con el fin de lanzar una nueva campaña comercial para los clientes que menos compran en la empresa, se pide una consulta SQL que retorne aquellos clientes cuyas ventas son inferiores a 1/3 del promedio de ventas del producto que más se vendió en el 2012.",
        "solution": "Select F1.fact_cliente, clie_razon_social, sum(I1.item_cantidad) as vendido_por_cliente,\n(select top 1 item_producto from Item_Factura I2 join Factura f2 on f2.fact_numero = I2.item_numero and f2.fact_tipo = I2.item_tipo and f2.fact_sucursal = I2.item_sucursal where f2.fact_cliente = F1.fact_cliente and year(f2.fact_fecha) = 2012 group by I2.item_producto order by sum(I2.item_cantidad) desc, item_producto asc)\nfrom Factura F1\njoin Item_Factura I1 on item_numero = fact_numero and item_sucursal = fact_sucursal and item_tipo = fact_tipo\njoin Cliente on fact_cliente = clie_codigo\nwhere year(fact_fecha) = 2012\ngroup by fact_cliente, clie_razon_social, clie_domicilio\nhaving sum(I1.item_cantidad* I1.item_precio) < (\n  select top 1 (avg(item_cantidad*item_precio)/3.0) as prom\n  from Item_Factura join Factura on item_numero = fact_numero and item_sucursal = fact_sucursal and item_tipo = fact_tipo\n  where year(fact_fecha) = 2012\n  group by item_producto\n  order by sum(item_cantidad) desc\n)\norder by clie_domicilio asc",
        "entities": [
            "Item_factura",
            "Factura",
            "Cliente"
        ]
    },
    {
        "id": 17,
        "category": "SQL",
        "statement": "Escriba una consulta que retorne una estadística de ventas por año y mes para cada producto. La consulta debe retornar: PERIODO, PROD, DETALLE, CANTIDAD_VENDIDA, VENTAS_AÑO_ANT, CANT_FACTURAS.",
        "solution": "SELECT CONVERT(CHAR(6), F1.fact_fecha, 112) AS PERIODO, I1.item_producto AS PROD, P.prod_detalle AS DETALLE, ISNULL(SUM(I1.item_cantidad), 0) AS CANTIDAD_VENDIDA,\nISNULL(( SELECT SUM(I_Ant.item_cantidad) FROM Item_Factura I_Ant JOIN Factura F_Ant ON I_Ant.item_tipo = F_Ant.fact_tipo AND I_Ant.item_sucursal = F_Ant.fact_sucursal AND I_Ant.item_numero = F_Ant.fact_numero WHERE I_Ant.item_producto = I1.item_producto AND MONTH(F_Ant.fact_fecha) = MONTH(F1.fact_fecha) AND YEAR(F_Ant.fact_fecha) = YEAR(F1.fact_fecha) - 1 ), 0) AS VENTAS_AÑO_ANT,\nISNULL(COUNT(DISTINCT F1.fact_tipo + F1.fact_sucursal + F1.fact_numero), 0) AS CANT_FACTURAS\nFROM Item_Factura I1\nJOIN Producto P ON P.prod_codigo = I1.item_producto\nJOIN Factura F1 ON F1.fact_tipo = I1.item_tipo AND F1.fact_sucursal = I1.item_sucursal AND F1.fact_numero = I1.item_numero\nGROUP BY CONVERT(CHAR(6), F1.fact_fecha, 112), MONTH(F1.fact_fecha), YEAR(F1.fact_fecha), I1.item_producto, P.prod_detalle\nORDER BY PERIODO ASC, PROD ASC;",
        "entities": [
            "Item_factura",
            "Factura",
            "Producto"
        ]
    },
    {
        "id": 18,
        "category": "SQL",
        "statement": "Escriba una consulta que retorne una estadística de ventas para todos los rubros. DETALLE_RUBRO, VENTAS, PROD1, PROD2, CLIENTE.",
        "solution": "Select rubr_detalle, isnull(sum(item_precio*item_cantidad), 0) as ventas,\nisnull((select top 1 item_producto from Item_Factura f1 join Producto p1 on f1.item_producto = p1.prod_codigo and p1.prod_rubro = rubr_id group by f1.item_producto order by sum(f1.item_cantidad) desc), '') as prod1,\nisnull((select top 1 item_producto from Item_Factura f1 join Producto p1 on f1.item_producto = p1.prod_codigo and p1.prod_rubro = rubr_id where item_producto != (select top 1 item_producto from Item_Factura f1 join Producto p1 on f1.item_producto = p1.prod_codigo and p1.prod_rubro = rubr_id group by f1.item_producto order by sum(f1.item_cantidad) desc) group by f1.item_producto order by sum(f1.item_cantidad) desc), '') as prod2,\nisnull((select top 1 fact_cliente from Factura join Item_Factura f3 on f3.item_numero = fact_numero and f3.item_tipo = fact_tipo and f3.item_sucursal = fact_sucursal join Producto p1 on f3.item_producto = p1.prod_codigo where rubr_id = p1.prod_rubro group by fact_cliente order by sum(f3.item_cantidad) desc ), '') as cliente\nfrom Rubro\nleft join Producto p on prod_rubro = rubr_id\nleft join Item_Factura on item_producto = prod_codigo\ngroup by rubr_detalle, rubr_id\norder by count(distinct item_producto) desc",
        "entities": [
            "Item_factura",
            "Producto",
            "Factura",
            "Rubro"
        ]
    },
    {
        "id": 19,
        "category": "SQL",
        "statement": "En virtud de una recategorizacion de productos referida a la familia de los mismos se solicita que desarrolle una consulta sql que retorne para todos los productos: Codigo, Detalle, Familia, Familia sugerida...",
        "solution": "select prod_codigo, prod_detalle, prod_familia, fami_detalle,\n(select top 1 f2.fami_id from Familia f2 join Producto p2 on p2.prod_familia = f2.fami_id where substring(p2.prod_detalle, 1, 5) = substring(p.prod_detalle, 0, 5) group by f2.fami_id, f2.fami_detalle order by count(*) desc, f2.fami_id asc ) as fami_2,\n(select top 1 f2.fami_detalle from Familia f2 join Producto p2 on p2.prod_familia = f2.fami_id where substring(p2.prod_detalle, 1, 5) = substring(p.prod_detalle, 0, 5) group by f2.fami_id, f2.fami_detalle order by count(*) desc, f2.fami_id asc )\nfrom Producto p\njoin Familia f on prod_familia = fami_id\nwhere (select top 1 f2.fami_id from Familia f2 join Producto p2 on p2.prod_familia = f2.fami_id where substring(p2.prod_detalle, 1, 5) = substring(p.prod_detalle, 0, 5) group by f2.fami_id, f2.fami_detalle order by count(*) desc, f2.fami_id asc ) != f.fami_id\norder by prod_detalle asc",
        "entities": [
            "Familia",
            "Producto"
        ]
    },
    {
        "id": 20,
        "category": "SQL",
        "statement": "Escriba una consulta sql que retorne un ranking de los mejores 3 empleados del 2012. Se debera retornar legajo, nombre y apellido, anio de ingreso, puntaje 2011, puntaje 2012.",
        "solution": "select empl_codigo, empl_nombre, empl_apellido, empl_ingreso,\ncase when (select count(*) from Factura f1 where f1.fact_vendedor = empl_codigo and year(f1.fact_fecha)=2011) >= 50 then (select count(*) from Factura f2 where f2.fact_vendedor = empl_codigo and year(f2.fact_fecha)=2011 and f2.fact_total > 100) else 0.5 * isnull((select count(*) from Factura f3 join Empleado e2 on f3.fact_vendedor = e2.empl_codigo where e2.empl_jefe = e.empl_codigo and year(f3.fact_fecha) = 2011 ), 0) end as puntaje_2011,\ncase when (select count(*) from Factura f1 where f1.fact_vendedor = empl_codigo and year(f1.fact_fecha)=2012) >= 50 then (select count(*) from Factura f2 where f2.fact_vendedor = empl_codigo and year(f2.fact_fecha)=2012 and f2.fact_total > 100) else 0.5 * isnull((select count(*) from Factura f3 join Empleado e2 on f3.fact_vendedor = e2.empl_codigo where e2.empl_jefe = e.empl_codigo and year(f3.fact_fecha) = 2012 ), 0) end as puntaje_2012\nfrom Empleado e\ngroup by empl_codigo, empl_nombre, empl_apellido, empl_ingreso",
        "entities": [
            "Factura",
            "Empleado"
        ]
    },
    {
        "id": 21,
        "category": "SQL",
        "statement": "Escriba una consulta sql que retorne para todos los años, en los cuales se haya hecho al menos una factura, la cantidad de clientes a los que se les facturó de manera incorrecta...",
        "solution": "SELECT YEAR(F_Out.fact_fecha) AS [Año],\nISNULL(( SELECT COUNT(DISTINCT F_Clie.fact_cliente) FROM Factura F_Clie WHERE YEAR(F_Clie.fact_fecha) = YEAR(F_Out.fact_fecha) AND EXISTS ( SELECT 1 FROM Item_Factura I WHERE I.item_tipo = F_Clie.fact_tipo AND I.item_sucursal = F_Clie.fact_sucursal AND I.item_numero = F_Clie.fact_numero HAVING ABS(F_Clie.fact_total - F_Clie.fact_total_impuestos - SUM(I.item_cantidad * I.item_precio)) > 1 ) ), 0) AS [Clientes Mal Facturados],\nISNULL(( SELECT COUNT(*) FROM Factura F_Mal WHERE YEAR(F_Mal.fact_fecha) = YEAR(F_Out.fact_fecha) AND EXISTS ( SELECT 1 FROM Item_Factura I WHERE I.item_tipo = F_Mal.fact_tipo AND I.item_sucursal = F_Mal.fact_sucursal AND I.item_numero = F_Mal.fact_numero HAVING ABS(F_Mal.fact_total - F_Mal.fact_total_impuestos - SUM(I.item_cantidad * I.item_precio)) > 1 ) ), 0) AS [Facturas Incorrectas]\nFROM Factura F_Out\nGROUP BY YEAR(F_Out.fact_fecha)\nORDER BY [Año] ASC;",
        "entities": [
            "Factura",
            "Item_factura"
        ]
    },
    {
        "id": 22,
        "category": "SQL",
        "statement": "Escriba una consulta sql que retorne una estadistica de venta para todos los rubros por trimestre contabilizando todos los años. Se mostraran como maximo 4 filas por rubro (1 por cada trimestre).",
        "solution": "SELECT R.rubr_detalle AS DETALLE_RUBRO, DATEPART(quarter, F.fact_fecha) AS NUMERO_TRIMESTRE, ISNULL(COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero), 0) AS CANT_FACTURAS, ISNULL(COUNT(DISTINCT I.item_producto), 0) AS CANT_PRODUCTOS_DIFERENTES\nFROM Rubro R\nJOIN Producto P ON P.prod_rubro = R.rubr_id\nJOIN Item_Factura I ON I.item_producto = P.prod_codigo\nJOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero\nWHERE P.prod_codigo NOT IN (SELECT DISTINCT comp_producto FROM Composicion)\nGROUP BY R.rubr_id, R.rubr_detalle, DATEPART(quarter, F.fact_fecha)\nHAVING COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) > 100\nORDER BY R.rubr_detalle ASC, CANT_FACTURAS DESC;",
        "entities": [
            "Rubro",
            "Producto",
            "Item_factura",
            "Factura",
            "Composicion"
        ]
    },
    {
        "id": 23,
        "category": "SQL",
        "statement": "Realizar una consulta SQL que para cada año muestre : Año, El producto con composición más vendido para ese año, Cantidad de productos que componen directamente al producto más vendido, La cantidad de facturas en las cuales aparece ese producto, El código de cliente que más compro ese producto, El porcentaje que representa la venta de ese producto respecto al total de venta del año.",
        "solution": "SELECT YEAR(F_Out.fact_fecha) AS AÑO,\n(SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC) AS PROD_COMP_ESTRELLA,\nISNULL(( SELECT COUNT(*) FROM Composicion WHERE comp_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) ), 0) AS CANT_COMPONENTES,\nISNULL(( SELECT COUNT(DISTINCT F_Cont.fact_tipo + F_Cont.fact_sucursal + F_Cont.fact_numero) FROM Item_Factura I_Cont JOIN Factura F_Cont ON I_Cont.item_tipo = F_Cont.fact_tipo AND I_Cont.item_sucursal = F_Cont.fact_sucursal AND I_Cont.item_numero = F_Cont.fact_numero WHERE YEAR(F_Cont.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Cont.item_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) ), 0) AS CANT_FACTURAS,\nISNULL(( SELECT TOP 1 F_Clie.fact_cliente FROM Item_Factura I_Clie JOIN Factura F_Clie ON I_Clie.item_tipo = F_Clie.fact_tipo AND I_Clie.item_sucursal = F_Clie.fact_sucursal AND I_Clie.item_numero = F_Clie.fact_numero WHERE YEAR(F_Clie.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Clie.item_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) GROUP BY F_Clie.fact_cliente ORDER BY SUM(I_Clie.item_cantidad) DESC, F_Clie.fact_cliente ASC ), '-') AS CLIENTE_MAYOR_COMPRA,\n(ISNULL(( SELECT SUM(I_P.item_cantidad * I_P.item_precio) FROM Item_Factura I_P JOIN Factura F_P ON I_P.item_tipo = F_P.fact_tipo AND I_P.item_sucursal = F_P.fact_sucursal AND I_P.item_numero = F_P.fact_numero WHERE YEAR(F_P.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_P.item_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) ), 0) / (SELECT SUM(F_Tot.fact_total) FROM Factura F_Tot WHERE YEAR(F_Tot.fact_fecha) = YEAR(F_Out.fact_fecha))) * 100 AS PORCENTAJE_ANUAL\nFROM Factura F_Out\nGROUP BY YEAR(F_Out.fact_fecha)\nORDER BY (SELECT SUM(F_Sub.fact_total) FROM Factura F_Sub WHERE YEAR(F_Sub.fact_fecha) = YEAR(F_Out.fact_fecha)) DESC;",
        "entities": [
            "Item_factura",
            "Factura",
            "Composicion"
        ]
    },
    {
        "id": 24,
        "category": "SQL",
        "statement": "Escriba una consulta que considerando solamente las facturas correspondientes a los dos vendedores con mayores comisiones, retorne los productos con composición facturados al menos en cinco facturas...",
        "solution": "SELECT P.prod_codigo AS CODIGO_PRODUCTO, P.prod_detalle AS NOMBRE_PRODUCTO, ISNULL(SUM(I.item_cantidad), 0) AS UNIDADES_FACTURADAS\nFROM Producto P\nJOIN Item_Factura I ON I.item_producto = P.prod_codigo\nJOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero\nWHERE F.fact_vendedor IN (SELECT TOP 2 empl_codigo FROM Empleado ORDER BY empl_comision DESC) AND P.prod_codigo IN (SELECT comp_producto FROM Composicion)\nGROUP BY P.prod_codigo, P.prod_detalle\nHAVING COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) >= 5\nORDER BY UNIDADES_FACTURADAS DESC;",
        "entities": [
            "Producto",
            "Item_factura",
            "Factura",
            "Empleado",
            "Composicion"
        ]
    },
    {
        "id": 25,
        "category": "SQL",
        "statement": "Realizar una consulta SQL que para cada año y familia muestre : a. Año b. El código de la familia más vendida en ese año...",
        "solution": "SELECT YEAR(F.fact_fecha) AS AÑO, Fa.fami_id AS COD_FAMILIA,\nISNULL((SELECT COUNT(*) FROM Rubro WHERE rubr_id IN (SELECT prod_rubro FROM Producto WHERE prod_familia = Fa.fami_id)), 0) AS CANT_RUBROS,\nISNULL(( SELECT COUNT(*) FROM Composicion WHERE comp_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Producto P_Max ON I_Max.item_producto = P_Max.prod_codigo JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F.fact_fecha) AND P_Max.prod_familia = Fa.fami_id AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) ), 0) AS COMPONENTES_PRODUCTO_ESTRELLA,\nCOUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) AS CANT_FACTURAS,\nISNULL(( SELECT TOP 1 F_C.fact_cliente FROM Item_Factura I_C JOIN Producto P_C ON I_C.item_producto = P_C.prod_codigo JOIN Factura F_C ON I_C.item_tipo = F_C.fact_tipo AND I_C.item_sucursal = F_C.fact_sucursal AND I_C.item_numero = F_C.fact_numero WHERE YEAR(F_C.fact_fecha) = YEAR(F.fact_fecha) AND P_C.prod_familia = Fa.fami_id GROUP BY F_C.fact_cliente ORDER BY SUM(I_C.item_cantidad) DESC, F_C.fact_cliente ASC ), '-') AS CLIENTE_LIDER,\nSTR((SUM(I.item_cantidad * I.item_precio) / (SELECT SUM(F_T.fact_total) FROM Factura F_T WHERE YEAR(F_T.fact_fecha) = YEAR(F.fact_fecha))) * 100, 5, 2) AS PORCENTAJE_VENTA\nFROM Familia Fa\nJOIN Producto P ON P.prod_familia = Fa.fami_id\nJOIN Item_Factura I ON I.item_producto = P.prod_codigo\nJOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero\nGROUP BY YEAR(F.fact_fecha), Fa.fami_id\nORDER BY AÑO DESC, SUM(I.item_cantidad * I.item_precio) DESC;",
        "entities": [
            "Rubro",
            "Producto",
            "Composicion",
            "Item_factura",
            "Factura",
            "Familia"
        ]
    },
    {
        "id": 26,
        "category": "SQL",
        "statement": "Escriba una consulta sql que retorne un ranking de empleados devolviendo las siguientes columnas: Empleado, Depósitos que tiene a cargo, Monto total facturado en el año corriente, Codigo de Cliente al que mas le vendió, Producto más vendido, Porcentaje de la venta de ese empleado sobre el total vendido ese año. Los datos deberan ser ordenados por venta del empleado de mayor a menor.",
        "solution": "SELECT \n    E.empl_nombre AS Empleado,\n    \n    -- 1. Depósitos a cargo\n    ISNULL((SELECT COUNT(*) FROM Deposito D WHERE D.depo_encargado = E.empl_codigo), 0) AS depositos_a_cargo,\n    \n    -- 2. Monto total facturado en el año corriente (Asumimos año actual o un año específico como 2012)\n    ISNULL(SUM(F.fact_total), 0) AS monto_total_facturado,\n    \n    -- 3. Código de Cliente al que más le vendió\n    ISNULL((\n        SELECT TOP 1 F2.fact_cliente\n        FROM Factura F2\n        WHERE F2.fact_vendedor = E.empl_codigo AND YEAR(F2.fact_fecha) = 2012\n        GROUP BY F2.fact_cliente\n        ORDER BY SUM(F2.fact_total) DESC\n    ), '-') AS cliente_estrella,\n    \n    -- 4. Producto más vendido por este empleado\n    ISNULL((\n        SELECT TOP 1 I.item_producto\n        FROM Item_Factura I\n        JOIN Factura F3 ON I.item_numero = F3.fact_numero \n                       AND I.item_sucursal = F3.fact_sucursal \n                       AND I.item_tipo = F3.fact_tipo\n        WHERE F3.fact_vendedor = E.empl_codigo AND YEAR(F3.fact_fecha) = 2012\n        GROUP BY I.item_producto\n        ORDER BY SUM(I.item_cantidad) DESC\n    ), '-') AS producto_mas_vendido,\n    \n    -- 5. Porcentaje de venta sobre el total\n    (ISNULL(SUM(F.fact_total), 0) / \n        (SELECT SUM(fact_total) FROM Factura WHERE YEAR(fact_fecha) = 2012)) * 100 AS porcentaje_venta\n\nFROM Empleado E\nLEFT JOIN Factura F ON E.empl_codigo = F.fact_vendedor AND YEAR(F.fact_fecha) = 2012\nGROUP BY E.empl_codigo, E.empl_nombre\nORDER BY monto_total_facturado DESC;",
        "entities": [
            "Deposito",
            "Factura",
            "Item_factura",
            "Empleado"
        ]
    },
    {
        "id": 27,
        "category": "SQL",
        "statement": "Escriba una consulta sql que retorne una estadística basada en la facturacion por año y envase devolviendo las siguientes columnas:\n- Año\n- Codigo de envase\n- Detalle del envase\n- Cantidad de productos que tienen ese envase\n- Cantidad de productos facturados de ese envase\n- Producto mas vendido de ese envase\n- Monto total de venta de ese envase en ese año\n- Porcentaje de la venta de ese envase respecto al total vendido de ese año\nLos datos deberan ser ordenados por año y dentro del año por el envase con más facturación de mayor a menor.",
        "solution": "SELECT \n    YEAR(F.fact_fecha) AS AÑO,\n    P.prod_envase AS COD_ENVASE, \n    enva_detalle,\n    COUNT(DISTINCT P.prod_codigo) AS CANT_PRODUCTOS_CON_ENVASE,\n    ISNULL(SUM(I.item_cantidad), 0) AS PRODUCTOS_FACTURADOS,\n\n    -- Producto más vendido de ese envase en el año\n    ISNULL((\n        SELECT TOP 1 I_Max.item_producto\n        FROM Item_Factura I_Max JOIN Producto P_Max ON I_Max.item_producto = P_Max.prod_codigo\n        JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero\n        WHERE YEAR(F_Max.fact_fecha) = YEAR(F.fact_fecha) AND P_Max.prod_envase = P.prod_envase\n        GROUP BY I_Max.item_producto\n        ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC\n    ), '-') AS PROD_MAS_VENDIDO,\n\n    SUM(I.item_cantidad * I.item_precio) AS MONTO_TOTAL_VENTA,\n    (SUM(I.item_cantidad * I.item_precio) / (SELECT SUM(F_T.fact_total) FROM Factura F_T WHERE YEAR(F_T.fact_fecha) = YEAR(F.fact_fecha))) * 100 AS PORCENTAJE_VENTA\n\nFROM Producto P\nJOIN Item_Factura I ON I.item_producto = P.prod_codigo\nJOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero\nJOIN Envases on P.prod_envase = enva_codigo\nGROUP BY YEAR(F.fact_fecha), P.prod_envase, enva_detalle\nORDER BY AÑO DESC, MONTO_TOTAL_VENTA DESC;",
        "entities": [
            "Item_factura",
            "Producto",
            "Factura",
            "Envases"
        ]
    },
    {
        "id": 28,
        "category": "SQL",
        "statement": "Escriba una consulta sql que retorne una estadística por Año y Vendedor que retorne las siguientes columnas:\n- Año\n- Codigo de Vendedor\n- Detalle del Vendedor\n- Cantidad de facturas que realizó en ese año\n- Cantidad de clientes a los cuales les vendió en ese año\n- Cantidad de productos facturados con composición en ese año\n- Cantidad de productos facturados sin composicion en ese año\n- Monto total vendido por ese vendedor en ese año\nLos datos deberan ser ordenados por año y dentro del año por el vendedor que haya vendido mas productos diferentes de mayor a menor.",
        "solution": "SELECT\n    YEAR(F.fact_fecha) AS ANIO,\n    E.empl_codigo,\n    CONCAT(E.empl_nombre, ' ', E.empl_apellido) AS DETALLE_VENDEDOR,\n\n    COUNT(\n        DISTINCT CONCAT(\n            F.fact_tipo,'-',\n            F.fact_sucursal,'-',\n            F.fact_numero\n        )\n    ) AS CANT_FACTURAS,\n\n    COUNT(DISTINCT F.fact_cliente) AS CANT_CLIENTES,\n\nCOUNT(DISTINCT CASE\n    WHEN C.comp_producto IS NOT NULL\n    THEN I.item_producto\nEND) AS PROD_CON_COMPOSICION,\n\nCOUNT(DISTINCT CASE\n    WHEN C.comp_producto IS NULL\n    THEN I.item_producto\nEND) AS PROD_SIN_COMPOSICION\n\n   , SUM(I.item_cantidad * I.item_precio) AS MONTO_TOTAL_VENDIDO\n\nFROM Empleado E\nJOIN Factura F\n    ON F.fact_vendedor = E.empl_codigo\nJOIN Item_Factura I\n    ON I.item_tipo = F.fact_tipo\n    AND I.item_sucursal = F.fact_sucursal\n    AND I.item_numero = F.fact_numero\nLEFT JOIN Composicion C\n    ON C.comp_producto = I.item_producto\n\nGROUP BY\n    YEAR(F.fact_fecha),\n    E.empl_codigo,\n    E.empl_nombre,\n    E.empl_apellido\n\nORDER BY YEAR(F.fact_fecha), COUNT(DISTINCT I.item_producto) DESC;",
        "entities": [
            "Empleado",
            "Factura",
            "Item_factura",
            "Composicion"
        ]
    },
    {
        "id": 29,
        "category": "SQL",
        "statement": "Se solicita que realice una estadística de venta por producto para el año 2011, solo para los productos que pertenezcan a las familias que tengan más de 20 productos asignados a ellas, la cual deberá devolver las siguientes columnas:\n- Código de producto\n- Descripción del producto\n- Cantidad vendida\n- Cantidad de facturas en la que esta ese producto\n- Monto total facturado de ese producto\nSolo se deberá mostrar un producto por fila en función a los considerandos establecidos antes. El resultado deberá ser ordenado por el la cantidad vendida de mayor a menor.",
        "solution": "Select prod_codigo, prod_detalle,\nsum(item_cantidad) as cantidad_vendida,\ncount(fact_tipo+fact_numero+fact_sucursal) as cantidad_facturas,\nsum(item_cantidad*item_precio) as total_facturado\nfrom Producto\njoin Item_Factura on prod_codigo = item_producto\njoin Factura on item_numero = fact_numero\nand item_sucursal = fact_sucursal\nand item_tipo = fact_tipo\nwhere year(fact_fecha) = 2011\nand prod_familia in \n\t(select prod_familia\n\tfrom Producto \n\tgroup by prod_familia\n\thaving count(*) > 20)\ngroup by prod_codigo, prod_detalle\norder by sum(item_cantidad) desc;",
        "entities": [
            "Producto",
            "Item_factura",
            "Factura"
        ]
    },
    {
        "id": 30,
        "category": "SQL",
        "statement": "Se desea obtener una estadistica de ventas del año 2012, para los empleados que sean jefes, o sea, que tengan empleados a su cargo, para ello se requiere que realice la consulta que retorne las siguientes columnas: Nombre del Jefe, Cantidad de empleados a cargo, Monto total vendido de los empleados a cargo, Cantidad de facturas realizadas por los empleados a cargo, Nombre del empleado con mejor ventas de ese jefe.",
        "solution": "select e1.empl_jefe, e2.empl_nombre,\ncount(distinct e1.empl_codigo) as empleados_a_cargo,\nsum(fact_total) as total_facturado,\ncount(DISTINCT fact_tipo + fact_sucursal + fact_numero) as total_facturas,\nisnull((select top 1 e3.empl_nombre from Empleado e3 join Factura f on f.fact_vendedor = e3.empl_codigo where e3.empl_jefe = e1.empl_jefe and year(f.fact_fecha) = 2012 group by e3.empl_codigo, e3.empl_nombre order by sum(f.fact_total) desc ), '-') as mayor_empleado\nfrom Empleado e1\njoin Empleado e2 on e1.empl_jefe = e2.empl_codigo\nleft join Factura on e1.empl_codigo = fact_vendedor and year(fact_fecha) = 2012\ngroup by e1.empl_jefe, e2.empl_nombre\nhaving count(DISTINCT fact_tipo + fact_sucursal + fact_numero) > 10\norder by sum(fact_total) desc",
        "entities": [
            "Empleado",
            "Factura"
        ]
    },
    {
        "id": 31,
        "category": "SQL",
        "statement": "Escriba una consulta sql que retorne una estadística por Año y Vendedor que retorne las siguientes columnas: Año, Codigo de Vendedor, Detalle del Vendedor, Cantidad de facturas que realizó en ese año, Cantidad de clientes a los cuales les vendió en ese año, Cantidad de productos facturados con composición en ese año, Cantidad de productos facturados sin composicion en ese año, Monto total vendido por ese vendedor en ese año.",
        "solution": "-- Solución no provista en el PDF.",
        "entities": []
    },
    {
        "id": 32,
        "category": "SQL",
        "statement": "Se desea conocer las familias que sus productos se facturaron juntos en las mismas facturas para ello se solicita que escriba una consulta sql que retorne los pares de familias que tienen productos que se facturaron juntos. Para ellos deberá devolver las siguientes columnas:\n- Código de familia\n- Detalle de familia\n- Código de familia\n- Detalle de familia\n- Cantidad de facturas\n- Total vendido\nLos datos deberan ser ordenados por Total vendido y solo se deben mostrar las familias que se vendieron juntas más de 10 veces.",
        "solution": "SELECT \n    P1.prod_familia AS COD_FAMILIA_1,\n    F1.fami_detalle AS DETALLE_FAMILIA_1,\n    P2.prod_familia AS COD_FAMILIA_2,\n    F2.fami_detalle AS DETALLE_FAMILIA_2,\n    COUNT(DISTINCT I1.item_tipo + I1.item_sucursal + I1.item_numero) AS CANT_FACTURAS,\n    ISNULL(SUM(I1.item_cantidad * I1.item_precio + I2.item_cantidad * I2.item_precio), 0) AS TOTAL_VENDIDO\nFROM Item_Factura I1\nJOIN Item_Factura I2 ON I1.item_tipo = I2.item_tipo \n                    AND I1.item_sucursal = I2.item_sucursal \n                    AND I1.item_numero = I2.item_numero\nJOIN Producto P1 ON I1.item_producto = P1.prod_codigo\nJOIN Producto P2 ON I2.item_producto = P2.prod_codigo\nJOIN Familia F1 ON P1.prod_familia = F1.fami_id\nJOIN Familia F2 ON P2.prod_familia = F2.fami_id\nWHERE P1.prod_familia < P2.prod_familia -- Elimina simetrías (A-B y B-A) y reflexividad\nGROUP BY P1.prod_familia, F1.fami_detalle, P2.prod_familia, F2.fami_detalle\nHAVING COUNT(DISTINCT I1.item_tipo + I1.item_sucursal + I1.item_numero) > 10\nORDER BY TOTAL_VENDIDO DESC;",
        "entities": [
            "Item_factura",
            "Producto",
            "Familia"
        ]
    },
    {
        "id": 33,
        "category": "SQL",
        "statement": "Se requiere obtener una estadística de venta de productos que sean componentes. Para ello se solicita que realiza la siguiente consulta que retorne la venta de los componentes del producto más vendido del año 2012. Se deberá mostrar:\na. Código de producto\nb. Nombre del producto\nc. Cantidad de unidades vendidas\nd. Cantidad de facturas en la cual se facturo\ne. Precio promedio facturado de ese producto.\nf. Total facturado para ese producto\nEl resultado deberá ser ordenado por el total vendido por producto para el año 2012.",
        "solution": "SELECT \n    P.prod_codigo AS COD_PRODUCTO,\n    P.prod_detalle AS NOMBRE_PRODUCTO,\n    ISNULL(SUM(I.item_cantidad), 0) AS UNIDADES_VENDIDAS,\n    COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) AS CANT_FACTURAS,\n    ISNULL(AVG(I.item_precio), 0) AS PRECIO_PROMEDIO,\n    ISNULL(SUM(I.item_cantidad * I.item_precio), 0) AS TOTAL_FACTURADO\nFROM Producto P\nJOIN Composicion C ON P.prod_codigo = C.comp_componente\nJOIN Item_Factura I ON I.item_producto = P.prod_codigo\nJOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero\nWHERE YEAR(F.fact_fecha) = 2012\n  AND C.comp_producto = ( -- Vinculado al combo estrella global de 2012\n      SELECT TOP 1 I_Max.item_producto\n      FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero\n      WHERE YEAR(F_Max.fact_fecha) = 2012\n      GROUP BY I_Max.item_producto\n      ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC\n  )\nGROUP BY P.prod_codigo, P.prod_detalle\nORDER BY TOTAL_FACTURADO DESC;",
        "entities": [
            "Producto",
            "Composicion",
            "Item_factura",
            "Factura"
        ]
    },
    {
        "id": 34,
        "category": "SQL",
        "statement": "Escriba una consulta sql que retorne para todos los rubros la cantidad de facturas mal facturadas por cada mes del año 2011 Se considera que una factura es incorrecta cuando en la misma factura se factutan productos de dos rubros diferentes. Si no hay facturas mal hechas se debe retornar 0. Las columnas que se deben mostrar son:\n1- Codigo de Rubro\n2- Mes\n3- Cantidad de facturas mal realizadas.",
        "solution": "SELECT \n    R.rubr_id AS COD_RUBRO,\n    M.mes_num AS MES,\n    ISNULL(COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero), 0) AS CANT_FACTURAS_MAL_HECHAS\nFROM Rubro R\n-- Tabla de control escalar para forzar la salida de los 12 meses de forma obligatoria\nCROSS JOIN (SELECT 1 AS mes_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) M\nLEFT JOIN Producto P ON P.prod_rubro = R.rubr_id\nLEFT JOIN Item_Factura I ON I.item_producto = P.prod_codigo\nLEFT JOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero\n                   AND YEAR(F.fact_fecha) = 2011 AND MONTH(F.fact_fecha) = M.mes_num\n                   -- La condición de error: que en la misma factura exista otra línea de otro rubro diferente\n                   AND EXISTS (\n                       SELECT 1 FROM Item_Factura I_Check JOIN Producto P_Check ON I_Check.item_producto = P_Check.prod_codigo\n                       WHERE I_Check.item_tipo = F.fact_tipo AND I_Check.item_sucursal = F.fact_sucursal AND I_Check.item_numero = F.fact_numero\n                         AND P_Check.prod_rubro != R.rubr_id\n                   )\nGROUP BY R.rubr_id, M.mes_num\nORDER BY COD_RUBRO ASC, MES ASC;",
        "entities": [
            "Rubro",
            "Producto",
            "Item_factura",
            "Factura"
        ]
    },
    {
        "id": 35,
        "category": "SQL",
        "statement": "Se requiere realizar una estadística de ventas por año y producto, para ello se solicita que escriba una consulta sql que retorne las siguientes columnas:\n- Año\n- Codigo de producto\n- Detalle del producto\n- Cantidad de facturas emitidas a ese producto ese año\n- Cantidad de vendedores diferentes que compraron ese producto ese año\n- Cantidad de productos a los cuales compone ese producto, si no compone a ninguno se debera retornar 0\n- Porcentaje de la venta de ese producto respecto a la venta total de ese año\nLos datos deberan ser ordenados por año y por producto con mayor cantidad vendida.",
        "solution": "SELECT \n    YEAR(F.fact_fecha) AS AÑO,\n    P.prod_codigo AS COD_PRODUCTO,\n    P.prod_detalle AS DETALLE_PRODUCTO,\n    COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) AS CANT_FACTURAS,\n    COUNT(DISTINCT F.fact_vendedor) AS VENDEDORES_DIFERENTES,\n    \n    -- Cantidad de combos en los que este artículo es componente (Hijo)\n    ISNULL((SELECT COUNT(*) FROM Composicion WHERE comp_componente = P.prod_codigo), 0) AS PRODUCTOS_A_LOS_CUALES_COMPONE,\n    \n    -- Impacto porcentual de la línea sobre la facturación global de ese año exacto\n    STR((SUM(I.item_cantidad * I.item_precio) / (SELECT SUM(F_T.fact_total) FROM Factura F_T WHERE YEAR(F_T.fact_fecha) = YEAR(F.fact_fecha))) * 100, 5, 2) AS PORCENTAJE_VENTA_ANUAL\n\nFROM Producto P\nJOIN Item_Factura I ON I.item_producto = P.prod_codigo\nJOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero\nGROUP BY YEAR(F.fact_fecha), P.prod_codigo, P.prod_detalle\nORDER BY AÑO DESC, SUM(I.item_cantidad) DESC; -- Ordenado por producto con mayor cantidad vendida",
        "entities": [
            "Composicion",
            "Factura",
            "Producto",
            "Item_factura"
        ]
    },
    {
        "id": 36,
        "category": "SQL",
        "statement": "Hecho en clase: Mostrar los 10 productos más vendidos en la historia también los 10 productos menos vendidos en la historia. Además mostrar de esos productos, quien fue el cliente que mayor compra realizo",
        "solution": "SELECT p.prod_detalle AS Nombre,\n( SELECT TOP 1 fact_cliente FROM Factura JOIN Item_Factura ON item_sucursal = fact_sucursal AND item_numero = fact_numero AND item_tipo = fact_tipo WHERE item_producto = p.prod_codigo GROUP BY fact_cliente ORDER BY SUM(item_cantidad) DESC ) AS clie_que_mas_compro\nFROM Producto p\nWHERE p.prod_codigo IN ( SELECT TOP 10 p1.prod_codigo AS Producto_Mas_Vendido FROM Producto p1 JOIN Item_Factura i ON p1.prod_codigo = i.item_producto GROUP BY p1.prod_codigo, p1.prod_detalle ORDER BY ISNULL(SUM(item_cantidad), 0) DESC )\nOR p.prod_codigo IN ( SELECT TOP 10 p1.prod_codigo AS Producto_Menos_Vendido FROM Producto p1 JOIN Item_Factura i ON p1.prod_codigo = i.item_producto GROUP BY p1.prod_codigo, p1.prod_detalle ORDER BY ISNULL(SUM(item_cantidad), 0) ASC );",
        "entities": [
            "Factura",
            "Item_factura",
            "Producto"
        ]
    },
    {
        "id": 37,
        "category": "SQL",
        "statement": "Mostrar los 10 productos más vendidos en la historia y también los 10 productos menos vendidos en la historia. Además mostrar de esos productos, quien fue el cliente que mayor compra realizo",
        "solution": "SELECT  \n    p.prod_detalle as Nombre, (\n        SELECT top 1 fact_cliente\n        from factura join item_factura\n            on item_sucursal = fact_sucursal and\n                item_numero = fact_numero and\n                item_tipo = fact_tipo\n        where item_producto = p.prod_codigo\n        group by fact_cliente\n        order by sum(item_cantidad) desc \n    ) as clie_que_mas_compro\nFROM Producto P\nWHERE p.prod_codigo in (\n    SELECT TOP 10 p1.prod_codigo as Producto_Mas_Vendido\n    FROM Producto P1\n    JOIN Item_Factura I ON p1.prod_codigo=i.item_producto\n    GROUP BY p1.prod_codigo, p1.prod_detalle\n    ORDER BY isnull(sum(item_cantidad),0) desc\n)\nOR prod_codigo in (\n    SELECT TOP 10 p1.prod_codigo as Producto_Menos_Vendido\n    FROM Producto P1\n    JOIN Item_Factura I ON p1.prod_codigo=i.item_producto\n    GROUP BY p1.prod_codigo, p1.prod_detalle\n    ORDER BY isnull(sum(item_cantidad),0) ASC\n)",
        "entities": [
            "Producto",
            "Factura",
            "Item_Factura"
        ]
    },
    {
        "id": 1,
        "category": "T-SQL",
        "statement": "Hacer una función que dado un artículo y un depósito devuelva un string que Indique el estado del depósito según el artículo. Si la cantidad almacenada es menor al límite retornar “OCUPACIÓN DEL DEPOSITO XX %” siendo XX el % de ocupación. Si la cantidad almacenada es mayor o igual al límite retornar “DEPOSITO COMPLETO”.",
        "solution": "CREATE FUNCTION estadoDepositoSegunProducto (@prod_codigo char(8), @deposito char(2))\nRETURNS varchar(100)\nAS\nBEGIN\n    DECLARE @result varchar(100)\n    SET @result = (\n\t\tSELECT \n\t\tCASE WHEN s.stoc_cantidad < s.stoc_stock_maximo\n\t\t\tTHEN 'OCUPACION DEL DEPOSITO '+ s.stoc_deposito + ': ' + RTRIM(CAST(CAST((s.stoc_cantidad * 100)/s.stoc_stock_maximo as float) as char)) + '%' \n\t\t\tELSE 'DEPOSITO COMPLETO'\n\t\t\tEND AS estado_deposito\n\t\t\tFROM Producto p\n\t\t\tLEFT JOIN STOCK s ON s.stoc_producto = p.prod_codigo\n\t\t\t\tWHERE \n\t\t\t\tp.prod_codigo = @prod_codigo\n\t\t\t\tAND s.stoc_deposito = @deposito\t\t\t\t\t\n\t)\n    RETURN @result\nEND;\n\nselect dbo.estadoDepositoSegunProducto('00000030', '00')",
        "entities": [
            "Producto",
            "Stock"
        ]
    },
    {
        "id": 2,
        "category": "T-SQL",
        "statement": "Realizar una función que dado un artículo y una fecha, retorne el stock que existía a esa fecha",
        "solution": "Create function stockByProdcutByDate (@prod_codigo char(8), @fecha date)\nreturns decimal(12,2)\nas\nbegin\ndeclare @maximo decimal(12,2)\ndeclare @stock_vendido decimal(12,2)\ndeclare @resultado decimal(12,2)\n\nselect @maximo=stoc_stock_maximo\nfrom stock\nwhere stoc_producto=@prod_codigo\n\nselect @stock_vendido = sum(item_cantidad)\nfrom Item_Factura I\nJoin Factura on I.item_numero = fact_numero\nand I.item_sucursal = fact_sucursal\nand I.item_tipo = fact_tipo\nwhere fact_fecha < @fecha\ngroup by I.item_producto\n\nset @resultado = @maximo - @stock_vendido\nreturn @resultado\nend\n\nselect dbo.stockByProdcutByDate('00000030', '2010-01-23 00:00:00')",
        "entities": [
            "Stock",
            "Item_factura",
            "Factura"
        ]
    },
    {
        "id": 3,
        "category": "T-SQL",
        "statement": "Cree el/los objetos de base de datos necesarios para corregir la tabla empleado en caso que sea necesario. Se sabe que debería existir un único gerente general (debería ser el único empleado sin jefe). Si detecta que hay más de un empleado sin jefe deberá elegir entre ellos el gerente general, el cual será seleccionado por mayor salario. Si hay más de uno se seleccionara el de mayor antigüedad en la empresa. Al finalizar la ejecución del objeto la tabla deberá cumplir con la regla de un único empleado sin jefe (el gerente general) y deberá retornar la cantidad de empleados que había sin jefe antes de la ejecución.",
        "solution": "CREATE PROCEDURE sp_gerente(@salida INT OUTPUT)\nAS\nBEGIN\n\tDECLARE @cantidad_sin_jefe INT\n\tDECLARE @v_gerente_gral NUMERIC(6)\n\n\tSELECT @cantidad_sin_jefe = COUNT(*)\n\t  FROM Empleado e\n     WHERE e.empl_jefe IS NULL\n\n\t IF @cantidad_sin_jefe > 1\n\t BEGIN\n\t\tSELECT TOP 1 @v_gerente_gral = e.empl_codigo\n\t\t  FROM Empleado e\n\t\t WHERE e.empl_jefe IS NULL\n\t  ORDER BY e.empl_salario DESC, e.empl_ingreso ASC\n      \n\t  UPDATE Empleado\n\t\t   SET empl_jefe = @v_gerente_gral\n         WHERE empl_jefe IS NULL\n\t\t   AND empl_codigo != @v_gerente_gral\n\t END\n\t SET @salida = @cantidad_sin_jefe\nEND\nGO\n\n-- 1. Declaramos una variable para ver la salida\nDECLARE @resultado NUMERIC;\n-- 2. Ejecutmos el store pasandole la variable como OUTPUT\nEXEC sp_gerente @salida = @resultado OUTPUT;\n-- 3. Imprimo el resultado en pantalla\nSELECT @resultado AS 'Cantidad de Empleados Sin Jefe Originales';",
        "entities": [
            "Empleado"
        ]
    },
    {
        "id": 4,
        "category": "T-SQL",
        "statement": "Cree el/los objetos de base de datos necesarios para actualizar la columna de empleado empl_comision con la sumatoria del total de lo vendido por ese empleado a lo largo del último año. Se deberá retornar el código del vendedor que más vendió (en monto) a lo largo del último año.",
        "solution": "CREATE PROCEDURE sp_actualizar_comisiones\n    @mejor_vendedor_out NUMERIC(6,0) OUTPUT\nAS\nBEGIN\n    \n    CREATE TABLE #Ventas (\n        vendedor NUMERIC(6,0),\n        total DECIMAL(12,2)\n    );\n\n    INSERT INTO #Ventas\n    SELECT fact_vendedor, SUM(fact_total)\n    FROM Factura\n    WHERE YEAR(fact_fecha) = 2012 -- O el año correspondiente [cite: 289]\n    GROUP BY fact_vendedor;\n\n    UPDATE Empleado\n    SET empl_comision = ISNULL((SELECT total FROM #Ventas WHERE vendedor = Empleado.empl_codigo), 0);\n\n    SELECT TOP 1 @mejor_vendedor_out = vendedor\n    FROM #Ventas\n    ORDER BY total DESC;\n\n    DROP TABLE #Ventas;\nEND;\n\n\nDECLARE @resultado NUMERIC(6,0);\nEXEC sp_actualizar_comisiones @mejor_vendedor_out = @resultado OUTPUT;\nSELECT @resultado AS 'Mejor empleado';",
        "entities": [
            "Factura"
        ]
    },
    {
        "id": 5,
        "category": "T-SQL",
        "statement": "Realizar un procedimiento que complete con los datos existentes en el modelo provisto la tabla de hechos denominada Fact_table tiene las siguiente definición:\nCreate table Fact_table\n( anio char(4),\nmes char(2),\nfamilia char(3),\nrubro char(4),\nzona char(3),\ncliente char(6),\nproducto char(8),\ncantidad decimal(12,2),\nmonto decimal(12,2)\n)\nAlter table Fact_table\nAdd constraint primary key(anio,mes,familia,rubro,zona,cliente,producto)",
        "solution": "CREATE PROCEDURE sp_completar_fact_table\nAS\nBEGIN\n    INSERT INTO Fact_table (anio, mes, familia, rubro, zona, cliente, producto, cantidad, monto)\n    SELECT \n        CAST(YEAR(f.fact_fecha) AS CHAR(4)), \n        CAST(MONTH(f.fact_fecha) AS CHAR(2)),\n        p.prod_familia, \n        p.prod_rubro, \n        d.depa_zona,\n        f.fact_cliente, \n        i.item_producto,\n        SUM(i.item_cantidad),\n        SUM(i.item_cantidad * i.item_precio)\n    FROM Factura f\n    JOIN Item_Factura i ON f.fact_numero = i.item_numero \n                        AND f.fact_sucursal = i.item_sucursal \n                        AND f.fact_tipo = i.item_tipo\n    JOIN Producto p ON i.item_producto = p.prod_codigo\n    JOIN Empleado e ON f.fact_vendedor = e.empl_codigo \n    JOIN Departamento d ON e.empl_departamento = d.depa_zona\n    GROUP BY \n        YEAR(f.fact_fecha), \n        MONTH(f.fact_fecha), \n        p.prod_familia, \n        p.prod_rubro, \n        d.depa_zona, \n        f.fact_cliente, \n        i.item_producto;\nEND;",
        "entities": [
            "Factura",
            "Item_factura",
            "Producto",
            "Empleado",
            "Departamento"
        ]
    },
    {
        "id": 6,
        "category": "T-SQL",
        "statement": "Realizar un procedimiento que si en alguna factura se facturaron componentes que conforman un combo determinado (o sea que juntos componen otro producto de mayor nivel), en cuyo caso deberá reemplazar las filas correspondientes a dichos productos por una sola fila con el producto que componen con la cantidad de dicho producto que corresponda.",
        "solution": "CREATE PROCEDURE sp_combos\nAS\nBEGIN\n\n    DECLARE @tipo CHAR(1),\n            @sucursal CHAR(4),\n            @numero CHAR(8),\n            @producto CHAR(8);\n\n    CREATE TABLE #insert_item\n    (\n        tempo_tipo CHAR(1),\n        tempo_sucursal CHAR(4),\n        tempo_numero CHAR(8),\n        tempo_compuesto CHAR(8)\n    );\n\n    CREATE TABLE #delete_item\n    (\n        tempo_tipo CHAR(1),\n        tempo_sucursal CHAR(4),\n        tempo_numero CHAR(8),\n        tempo_componente CHAR(8)\n    );\n\n    DECLARE c_compuesto CURSOR FOR\n        SELECT c.comp_producto,\n               i.item_tipo,\n               i.item_sucursal,\n               i.item_numero\n        FROM Composicion c\n        INNER JOIN Item_Factura i\n            ON c.comp_componente = i.item_producto\n        WHERE i.item_cantidad = c.comp_cantidad\n        GROUP BY c.comp_producto,\n                 i.item_tipo,\n                 i.item_sucursal,\n                 i.item_numero\n        HAVING COUNT(*) =\n        (\n            SELECT COUNT(*)\n            FROM Composicion c2\n            WHERE c2.comp_producto = c.comp_producto\n        );\n\n    OPEN c_compuesto;\n\n    FETCH NEXT FROM c_compuesto\n    INTO @producto, @tipo, @sucursal, @numero;\n\n    WHILE @@FETCH_STATUS = 0\n    BEGIN\n\n        INSERT INTO #insert_item\n        VALUES (@tipo, @sucursal, @numero, @producto);\n\n        INSERT INTO #delete_item\n        SELECT @tipo,\n               @sucursal,\n               @numero,\n               comp_componente\n        FROM Composicion\n        WHERE comp_producto = @producto;\n\n        FETCH NEXT FROM c_compuesto\n        INTO @producto, @tipo, @sucursal, @numero;\n\n    END\n\n    CLOSE c_compuesto;\n    DEALLOCATE c_compuesto;\n\n    BEGIN TRANSACTION;\n\n    INSERT INTO Item_Factura\n    (\n        item_tipo,\n        item_sucursal,\n        item_numero,\n        item_producto,\n        item_cantidad,\n        item_precio\n    )\n    SELECT\n        tempo_tipo,\n        tempo_sucursal,\n        tempo_numero,\n        tempo_compuesto,\n        1,\n        p.prod_precio\n    FROM #insert_item i\n    INNER JOIN Producto p\n        ON i.tempo_compuesto = p.prod_codigo;\n\n    DELETE FROM Item_Factura\n    WHERE item_tipo + item_sucursal + item_numero + item_producto IN\n    (\n        SELECT tempo_tipo + tempo_sucursal + tempo_numero + tempo_componente\n        FROM #delete_item\n    );\n\n    COMMIT TRANSACTION;\n\nEND;",
        "entities": [
            "Composicion",
            "Item_factura",
            "C_compuesto",
            "Producto"
        ]
    },
    {
        "id": 7,
        "category": "T-SQL",
        "statement": "Hacer un procedimiento que dadas dos fechas complete la tabla Ventas. Debe insertar una línea por cada artículo con los movimientos de stock generados por las ventas entre esas fechas. La tabla se encuentra creada y vacía.",
        "solution": "CREATE PROCEDURE sp_completar_ventas\n    @fecha_desde DATETIME,\n    @fecha_hasta DATETIME\nAS\nBEGIN\n    INSERT INTO VENTAS (codigo, detalle, cant_mov, precio_promedio, linea, ganancia)\n    SELECT i.item_producto, p.prod_detalle, COUNT(*), AVG(i.item_precio),\n    ROW_NUMBER() OVER(ORDER BY i.item_producto),\n           (SUM(i.item_precio * i.item_cantidad) - SUM(i.item_cantidad * p.prod_precio))\n    FROM Item_Factura i\n    JOIN Factura f ON i.item_numero = f.fact_numero\n    and i.item_sucursal = f.fact_sucursal\n    and i.item_tipo = f.fact_tipo\n    JOIN Producto p ON i.item_producto = p.prod_codigo\n    WHERE f.fact_fecha BETWEEN @fecha_desde AND @fecha_hasta\n    GROUP BY i.item_producto, p.prod_detalle;\nEND;",
        "entities": [
            "Item_factura",
            "Factura",
            "Producto"
        ]
    },
    {
        "id": 8,
        "category": "T-SQL",
        "statement": "Realizar un procedimiento que complete la tabla Diferencias de precios, para los productos facturados que tengan composición y en los cuales el precio de facturación sea diferente al precio del cálculo de los precios unitarios por cantidad de sus componentes...",
        "solution": "CREATE TABLE DIFERENCIAS (\n    codigo CHAR(8),\n    detalle CHAR(50),\n    cantidad INT,\n    precio_generado DECIMAL(12,2),\n    precio_facturado DECIMAL(12,2)\n);\n\nCREATE FUNCTION dbo.fn_obtener_precio (@prod_codigo CHAR(8))\nRETURNS DECIMAL(12,2)\nAS\nBEGIN\n    DECLARE @precio_total DECIMAL(12,2);\n\n    -- Usamos una CTE para recorrer todos los niveles de la composición de forma recursiva\n    WITH RecursoPrecio AS (\n        -- Caso base: obtenemos los componentes directos del producto\n        SELECT comp_producto, comp_componente, comp_cantidad\n        FROM Composicion\n        WHERE comp_producto = @prod_codigo\n        \n        UNION ALL\n        \n        -- Caso recursivo: buscamos los componentes de los componentes\n        SELECT c.comp_producto, c.comp_componente, c.comp_cantidad\n        FROM Composicion c\n        JOIN RecursoPrecio rp ON c.comp_producto = rp.comp_componente\n    )\n    -- Sumamos el precio de los componentes base (los que no tienen composición propia)\n    -- multiplicado por la cantidad requerida en cada nivel\n    SELECT @precio_total = SUM(p.prod_precio * rp.comp_cantidad)\n    FROM RecursoPrecio rp\n    JOIN Producto p ON rp.comp_componente = p.prod_codigo\n    -- Solo sumamos aquellos que no son productos compuestos en sí mismos (opcional, según lógica)\n    WHERE NOT EXISTS (SELECT 1 FROM Composicion WHERE comp_producto = rp.comp_componente);\n\n    -- Si el producto no tiene componentes (es simple), devolvemos su precio directo\n    IF @precio_total IS NULL\n    BEGIN\n        SELECT @precio_total = prod_precio \n        FROM Producto \n        WHERE prod_codigo = @prod_codigo;\n    END\n\n    RETURN ISNULL(@precio_total, 0);\nEND;\n\nCREATE PROCEDURE sp_generar_diferencias_precios\nAS\nBEGIN\n    -- Limpiamos la tabla antes de insertar los nuevos datos calculados\n    TRUNCATE TABLE DIFERENCIAS;\n\n    -- Insertamos los productos facturados con discrepancia de precio\n    INSERT INTO DIFERENCIAS (codigo, detalle, cantidad, precio_generado, precio_facturado)\n    SELECT \n        p.prod_codigo, \n        p.prod_detalle, \n        (SELECT COUNT(*) FROM Composicion WHERE comp_producto = p.prod_codigo),\n        dbo.fn_obtener_precio(p.prod_codigo), \n        p.prod_precio\n    FROM Producto p\n    INNER JOIN Item_Factura i ON p.prod_codigo = i.item_producto\n    WHERE EXISTS (SELECT 1 FROM Composicion WHERE comp_producto = p.prod_codigo)\n      AND p.prod_precio <> dbo.fn_obtener_precio(p.prod_codigo)\n    GROUP BY p.prod_codigo, p.prod_detalle, p.prod_precio;\nEND;\n\n--- Solución Alternativa ---\nCREATE PROCEDURE sp_generar_diferencias_precios\nAS\nBEGIN\n    TRUNCATE TABLE DIFERENCIAS;\n\n    -- Cursor para recorrer los productos que tienen composición\n    DECLARE @prod_codigo CHAR(8), @prod_precio_facturado DECIMAL(12,2), @precio_calculado DECIMAL(12,2);\n    \n    DECLARE c_productos CURSOR FOR \n    SELECT p.prod_codigo, p.prod_precio \n    FROM Producto p \n    WHERE EXISTS (SELECT 1 FROM Composicion WHERE comp_producto = p.prod_codigo)\n    GROUP BY p.prod_codigo, p.prod_precio;\n\n    OPEN c_productos;\n    FETCH NEXT FROM c_productos INTO @prod_codigo, @prod_precio_facturado;\n\n    WHILE @@FETCH_STATUS = 0\n    BEGIN\n        -- Tabla temporal para la recursión manual\n        CREATE TABLE #Componentes (cod CHAR(8), cant DECIMAL(12,2));\n        INSERT INTO #Componentes SELECT comp_componente, comp_cantidad FROM Composicion WHERE comp_producto = @prod_codigo;\n\n        -- Iterar mientras existan componentes que a su vez tengan composición\n        WHILE EXISTS (SELECT 1 FROM #Componentes c JOIN Composicion comp ON c.cod = comp.comp_producto)\n        BEGIN\n            INSERT INTO #Componentes\n            SELECT comp.comp_componente, c.cant * comp.comp_cantidad\n            FROM #Componentes c\n            JOIN Composicion comp ON c.cod = comp.comp_producto;\n\n            DELETE FROM #Componentes WHERE cod IN (SELECT comp_producto FROM Composicion);\n        END\n\n        -- Calcular precio final basado en componentes base\n        SELECT @precio_calculado = SUM(c.cant * p.prod_precio)\n        FROM #Componentes c\n        JOIN Producto p ON c.cod = p.prod_codigo;\n\n        -- Insertar si hay diferencia\n        IF ISNULL(@precio_calculado, 0) <> @prod_precio_facturado\n        BEGIN\n            INSERT INTO DIFERENCIAS (codigo, detalle, cantidad, precio_generado, precio_facturado)\n            SELECT @prod_codigo, prod_detalle, (SELECT COUNT(*) FROM Composicion WHERE comp_producto = @prod_codigo), @precio_calculado, @prod_precio_facturado\n            FROM Producto WHERE prod_codigo = @prod_codigo;\n        END\n\n        DROP TABLE #Componentes;\n        FETCH NEXT FROM c_productos INTO @prod_codigo, @prod_precio_facturado;\n    END\n\n    CLOSE c_productos;\n    DEALLOCATE c_productos;\nEND",
        "entities": [
            "Composicion",
            "Producto",
            "Item_factura"
        ]
    },
    {
        "id": 9,
        "category": "T-SQL",
        "statement": "Crear el/los objetos de base de datos que ante alguna modificación de un ítem de factura de un artículo con composición realice el movimiento de sus correspondientes componentes.",
        "solution": "CREATE TRIGGER tr_ActualizarStockComponentes\nON Item_Factura\nAFTER UPDATE\nAS\nBEGIN\n    UPDATE STOCK \n    SET stoc_cantidad = stoc_cantidad + (d.item_cantidad - i.item_cantidad) * c.comp_cantidad\n    FROM deleted d\n    JOIN inserted i ON d.item_numero = i.item_numero \n                    AND d.item_tipo = i.item_tipo \n                    AND d.item_sucursal = i.item_sucursal \n                    AND d.item_producto = i.item_producto\n    JOIN Composicion c ON i.item_producto = c.comp_producto\n    WHERE STOCK.stoc_producto = c.comp_componente;\nEND;",
        "entities": [
            "Composicion"
        ]
    },
    {
        "id": 10,
        "category": "T-SQL",
        "statement": "Crear el/los objetos de base de datos que ante el intento de borrar un artículo verifique que no exista stock y si es así lo borre en caso contrario que emita un mensaje de error.",
        "solution": "CREATE TRIGGER tr_NoBorrarProducto\nON Producto\nINSTEAD OF DELETE\nAS\nBEGIN\n    if exists\n    (SELECT 1 \n        FROM STOCK s\n        JOIN deleted d ON s.stoc_producto = d.prod_codigo\n        WHERE s.stoc_cantidad > 0)\n    begin\n        RAISERROR ('No está permitido borrar productos de la base de datos con stock', 16, 1);\n        ROLLBACK TRANSACTION;\n    end\n    else\n        begin\n        delete from Producto\n        where prod_codigo in (select prod_codigo from deleted)\n        end\n    END;",
        "entities": [
            "Stock",
            "Producto"
        ]
    },
    {
        "id": 11,
        "category": "T-SQL",
        "statement": "Cree el/los objetos de base de datos necesarios para que dado un código de empleado se retorne la cantidad de empleados que este tiene a su cargo (directa o indirectamente). Solo contar aquellos empleados (directos o indirectos) que tengan un código mayor que su jefe directo.",
        "solution": "CREATE FUNCTION fn_contar_subordinados (@empl_codigo NUMERIC(6))\nRETURNS INT\nAS\nBEGIN\n    DECLARE @total INT;\n    WITH CTE_Jerarquia AS (\n        SELECT empl_codigo, empl_jefe \n        FROM Empleado \n        WHERE empl_jefe = @empl_codigo AND empl_codigo > @empl_codigo\n        UNION ALL\n        \n        SELECT e.empl_codigo, e.empl_jefe\n        FROM Empleado e\n        JOIN CTE_Jerarquia c ON e.empl_jefe = c.empl_codigo\n        WHERE e.empl_codigo > c.empl_codigo\n    )\n    SELECT @total = COUNT(*) FROM CTE_Jerarquia;\n    RETURN @total;\nEND;\n\n--- Solución Alternativa ---\nCREATE FUNCTION fn_contar_subordinados (@empl_codigo NUMERIC(6))\nRETURNS INT\nAS\nBEGIN\n    DECLARE @total INT = 0;\n    \n    -- Tabla para almacenar subordinados encontrados\n    CREATE TABLE #Subordinados (codigo NUMERIC(6));\n    \n    -- Insertar nivel 1 (subordinados directos que cumplen la condición de código)\n    INSERT INTO #Subordinados\n    SELECT empl_codigo FROM Empleado \n    WHERE empl_jefe = @empl_codigo AND empl_codigo > @empl_codigo;\n\n    -- Iterar para buscar niveles inferiores\n    DECLARE @cambios INT = 1;\n    WHILE @cambios > 0\n    BEGIN\n        INSERT INTO #Subordinados\n        SELECT e.empl_codigo\n        FROM Empleado e\n        JOIN #Subordinados s ON e.empl_jefe = s.codigo\n        WHERE e.empl_codigo > s.codigo\n        AND NOT EXISTS (SELECT 1 FROM #Subordinados WHERE codigo = e.empl_codigo);\n        \n        SET @cambios = @@ROWCOUNT;\n    END\n\n    SELECT @total = COUNT(*) FROM #Subordinados;\n    DROP TABLE #Subordinados;\n    \n    RETURN @total;\nEND",
        "entities": [
            "Empleado"
        ]
    },
    {
        "id": 12,
        "category": "T-SQL",
        "statement": "Cree el/los objetos de base de datos necesarios para que nunca un producto pueda ser compuesto por sí mismo. Se sabe que en la actualidad dicha regla se cumple y que la base de datos es accedida por n aplicaciones de diferentes tipos y tecnologías. No se conoce la cantidad de niveles de composición existentes.",
        "solution": "CREATE TRIGGER tr_EvitarAutocomposicion\nON Composicion\nAFTER INSERT\nAS\nBEGIN\n    DECLARE @padre CHAR(8), @hijo CHAR(8);\n    \n    -- Capturamos los datos del nuevo registro\n    SELECT @padre = comp_producto, @hijo = comp_componente FROM inserted;\n\n    -- Validación 1: Caso directo A -> A\n    IF @padre = @hijo\n    BEGIN\n        RAISERROR ('Error: Un producto no puede componerse a sí mismo.', 16, 1);\n        ROLLBACK TRANSACTION;\n        RETURN;\n    END\n\n    -- Validación 2: Ciclo recursivo\n    -- En lugar de poner el WITH dentro del IF EXISTS, lo usamos para cargar una tabla\n    DECLARE @Ciclo TABLE (id INT IDENTITY(1,1), producto CHAR(8), componente CHAR(8));\n\n    ;WITH CTE_Recursiva AS (\n        SELECT comp_producto, comp_componente\n        FROM Composicion\n        WHERE comp_producto = @hijo\n        UNION ALL\n        SELECT c.comp_producto, c.comp_componente\n        FROM Composicion c\n        JOIN CTE_Recursiva r ON c.comp_producto = r.comp_componente\n    )\n    INSERT INTO @Ciclo (producto, componente)\n    SELECT comp_producto, comp_componente FROM CTE_Recursiva;\n\n    -- Ahora hacemos el IF EXISTS sobre la variable de tabla que ya cargamos\n    IF EXISTS (SELECT 1 FROM @Ciclo WHERE componente = @padre)\n    BEGIN\n        RAISERROR ('Error: La composición genera un ciclo recursivo.', 16, 1);\n        ROLLBACK TRANSACTION;\n    END\nEND;",
        "entities": [
            "Composicion"
        ]
    },
    {
        "id": 13,
        "category": "T-SQL",
        "statement": "Cree el/los objetos de base de datos necesarios para implantar la siguiente regla “Ningún jefe puede tener un salario mayor al 20% de las suma de los salarios de sus empleados totales (directos + indirectos)”. Se sabe que en la actualidad dicha regla se cumple y que la base de datos es accedida por n aplicaciones de diferentes tipos y tecnologías",
        "solution": "CREATE TRIGGER tr_ValidarSalarioJefe\nON Empleado\nAFTER UPDATE\nAS\nBEGIN\n    IF EXISTS (\n        SELECT 1 FROM inserted i\n        WHERE i.empl_salario > (SELECT SUM(empl_salario) * 0.20 FROM Empleado WHERE empl_jefe = i.empl_codigo)\n    )\n    BEGIN\n        RAISERROR ('El salario del jefe supera el 20%% de la suma de sus subordinados.', 16, 1);\n        ROLLBACK TRANSACTION;\n    END\nEND;",
        "entities": [
            "Empleado"
        ]
    },
    {
        "id": 14,
        "category": "T-SQL",
        "statement": "Agregar el/los objetos necesarios para que si un cliente compra un producto compuesto a un precio menor que la suma de los precios de sus componentes que imprima la fecha, que cliente, que productos y a qué precio se realizó la compra. No se deberá permitir que dicho precio sea menor a la mitad de la suma de los componentes.",
        "solution": "CREATE FUNCTION dbo.fn_obtener_precio (@prod_codigo CHAR(8))\nRETURNS DECIMAL(12,2)\nAS\nBEGIN\n    DECLARE @precio_total DECIMAL(12,2);\n\n    -- Usamos una CTE para recorrer todos los niveles de la composición de forma recursiva\n    WITH RecursoPrecio AS (\n        -- Caso base: obtenemos los componentes directos del producto\n        SELECT comp_producto, comp_componente, comp_cantidad\n        FROM Composicion\n        WHERE comp_producto = @prod_codigo\n        \n        UNION ALL\n        \n        -- Caso recursivo: buscamos los componentes de los componentes\n        SELECT c.comp_producto, c.comp_componente, c.comp_cantidad\n        FROM Composicion c\n        JOIN RecursoPrecio rp ON c.comp_producto = rp.comp_componente\n    )\n    -- Sumamos el precio de los componentes base (los que no tienen composición propia)\n    -- multiplicado por la cantidad requerida en cada nivel\n    SELECT @precio_total = SUM(p.prod_precio * rp.comp_cantidad)\n    FROM RecursoPrecio rp\n    JOIN Producto p ON rp.comp_componente = p.prod_codigo\n    -- Solo sumamos aquellos que no son productos compuestos en sí mismos (opcional, según lógica)\n    WHERE NOT EXISTS (SELECT 1 FROM Composicion WHERE comp_producto = rp.comp_componente);\n\n    -- Si el producto no tiene componentes (es simple), devolvemos su precio directo\n    IF @precio_total IS NULL\n    BEGIN\n        SELECT @precio_total = prod_precio \n        FROM Producto \n        WHERE prod_codigo = @prod_codigo;\n    END\n\n    RETURN ISNULL(@precio_total, 0);\nEND;\n\n\nCREATE TRIGGER tr_ControlPrecioCombo\nON Item_Factura\nAFTER INSERT\nAS\nBEGIN\n    IF EXISTS (\n        SELECT 1 FROM inserted i\n        JOIN Producto p ON i.item_producto = p.prod_codigo\n        WHERE i.item_precio < (dbo.fn_obtener_precio(i.item_producto) / 2)\n    )\n    BEGIN\n        PRINT 'Alerta: Venta por debajo del 50% del valor de componentes.';\n        -- La consigna pide imprimir y no permitir.\n        ROLLBACK TRANSACTION;\n    END\nEND;",
        "entities": [
            "Composicion",
            "Producto"
        ]
    },
    {
        "id": 15,
        "category": "T-SQL",
        "statement": "Cree el/los objetos de base de datos necesarios para que el objeto principal reciba un producto como parametro y retorne el precio del mismo. Se debe prever que el precio de los productos compuestos sera la sumatoria de los componentes del mismo multiplicado por sus respectivas cantidades. No se conocen los nivles de anidamiento posibles de los productos. Se asegura que nunca un producto esta compuesto por si mismo a ningun nivel. El objeto principal debe poder ser utilizado como filtro en el where de una sentencia select.",
        "solution": "CREATE FUNCTION dbo.fn_obtener_precio (@prod_codigo CHAR(8))\nRETURNS DECIMAL(12,2)\nAS\nBEGIN\n    DECLARE @precio_total DECIMAL(12,2);\n\n    -- Usamos una CTE para recorrer todos los niveles de la composición de forma recursiva\n    WITH RecursoPrecio AS (\n        -- Caso base: obtenemos los componentes directos del producto\n        SELECT comp_producto, comp_componente, comp_cantidad\n        FROM Composicion\n        WHERE comp_producto = @prod_codigo\n        \n        UNION ALL\n        \n        -- Caso recursivo: buscamos los componentes de los componentes\n        SELECT c.comp_producto, c.comp_componente, c.comp_cantidad\n        FROM Composicion c\n        JOIN RecursoPrecio rp ON c.comp_producto = rp.comp_componente\n    )\n    -- Sumamos el precio de los componentes base (los que no tienen composición propia)\n    -- multiplicado por la cantidad requerida en cada nivel\n    SELECT @precio_total = SUM(p.prod_precio * rp.comp_cantidad)\n    FROM RecursoPrecio rp\n    JOIN Producto p ON rp.comp_componente = p.prod_codigo\n    -- Solo sumamos aquellos que no son productos compuestos en sí mismos (opcional, según lógica)\n    WHERE NOT EXISTS (SELECT 1 FROM Composicion WHERE comp_producto = rp.comp_componente);\n\n    -- Si el producto no tiene componentes (es simple), devolvemos su precio directo\n    IF @precio_total IS NULL\n    BEGIN\n        SELECT @precio_total = prod_precio \n        FROM Producto \n        WHERE prod_codigo = @prod_codigo;\n    END\n\n    RETURN ISNULL(@precio_total, 0);\nEND;",
        "entities": [
            "Composicion",
            "Producto"
        ]
    },
    {
        "id": 16,
        "category": "T-SQL",
        "statement": "Desarrolle el/los elementos de base de datos necesarios para que ante una venta automaticamante se descuenten del stock los articulos vendidos. Se descontaran del deposito que mas producto poseea y se supone que el stock se almacena tanto de productos simples como compuestos (si se acaba el stock de los compuestos no se arman combos) En caso que no alcance el stock de un deposito se descontara del siguiente y asi hasta agotar los depositos posibles. En ultima instancia se dejara stock negativo en el ultimo deposito que se desconto.",
        "solution": "CREATE TRIGGER tr_InsertarFactura\nON Item_Factura\nAFTER INSERT\nAS\n    BEGIN\n    -- Declaramos variables para el cursor\n    DECLARE @producto CHAR(8), @cantidad_a_descontar DECIMAL(12,2);\n    \n    -- Cursor para procesar cada ítem insertado\n    DECLARE c_items CURSOR FOR \n    SELECT item_producto, item_cantidad FROM inserted;\n\n    OPEN c_items;\n    FETCH NEXT FROM c_items INTO @producto, @cantidad_a_descontar;\n\n    WHILE @@FETCH_STATUS = 0\n    BEGIN\n\n        -- Dentro del WHILE del cursor...\n        DECLARE @deposito_actual CHAR(2), @stock_disponible DECIMAL(12,2);\n\n        -- Cursor interno para recorrer depósitos ordenados de mayor a menor stock\n        DECLARE c_depositos CURSOR FOR \n        SELECT stoc_deposito, stoc_cantidad \n        FROM STOCK \n        WHERE stoc_producto = @producto \n        ORDER BY stoc_cantidad DESC;\n\n        OPEN c_depositos;\n        FETCH NEXT FROM c_depositos INTO @deposito_actual, @stock_disponible;\n\n        WHILE @@FETCH_STATUS = 0 AND @cantidad_a_descontar > 0\n        BEGIN\n            -- Si el stock alcanza para cubrir la venta\n            IF @stock_disponible >= @cantidad_a_descontar\n            BEGIN\n                UPDATE STOCK SET stoc_cantidad = stoc_cantidad - @cantidad_a_descontar\n                WHERE stoc_producto = @producto AND stoc_deposito = @deposito_actual;\n        \n                SET @cantidad_a_descontar = 0; -- Ya cubrimos todo\n            END\n            ELSE\n            BEGIN\n                -- Si el stock no alcanza, consumimos todo este depósito\n                UPDATE STOCK SET stoc_cantidad = 0\n                WHERE stoc_producto = @producto AND stoc_deposito = @deposito_actual;\n        \n                SET @cantidad_a_descontar = @cantidad_a_descontar - @stock_disponible;\n        \n                -- Verificamos si es el último depósito para dejarlo en negativo\n                -- (Si al hacer fetch del siguiente da -1, es el último)\n                DECLARE @es_ultimo INT;\n                SELECT @es_ultimo = count(*) FROM STOCK WHERE stoc_producto = @producto \n                                   AND stoc_cantidad > 0;\n        \n                -- Si es el último, restamos el remanente en negativo\n                IF @cantidad_a_descontar > 0 AND (SELECT count(*) FROM STOCK WHERE stoc_producto = @producto) = 1\n                BEGIN\n                     UPDATE STOCK SET stoc_cantidad = stoc_cantidad - @cantidad_a_descontar\n                     WHERE stoc_producto = @producto AND stoc_deposito = @deposito_actual;\n                     SET @cantidad_a_descontar = 0;\n                END\n            END\n\n                FETCH NEXT FROM c_depositos INTO @deposito_actual, @stock_disponible;\n            END\n            CLOSE c_depositos;\n            DEALLOCATE c_depositos;\n\n    FETCH NEXT FROM c_items INTO @producto, @cantidad_a_descontar;\n    END\n\n    CLOSE c_items;\n    DEALLOCATE c_items;\nend",
        "entities": [
            "C_items",
            "Stock",
            "C_depositos"
        ]
    },
    {
        "id": 17,
        "category": "T-SQL",
        "statement": "Sabiendo que el punto de reposición del stock es la menor cantidad de ese objeto que se debe almacenar en el depósito y que el stock máximo es la maxima cantidad de ese producto en ese depósito, cree él/los objetos de base de datos necesarios para que dicha regla de negocio se cumpla automáticamente. No se conoce la forma de acceso a los datos ni el procedimiento por el cual se incrementa o descuenta stock",
        "solution": "CREATE TRIGGER tr_ControlStock\nON STOCK\nAFTER UPDATE\nAS\nBEGIN\n    IF EXISTS (SELECT 1 FROM inserted WHERE stoc_cantidad < stoc_punto_reposicion OR stoc_cantidad > stoc_stock_maximo)\n    BEGIN\n        RAISERROR ('Violación de niveles de stock.', 16, 1);\n        ROLLBACK TRANSACTION;\n    END\nEND;",
        "entities": []
    },
    {
        "id": 18,
        "category": "T-SQL",
        "statement": "Sabiendo que el limite de credito de un cliente es el monto maximo que se le puede facturar mensualmente, cree el/los objetos de base de datos necesarios para que dicha regla de negocio se cumpla automáticamente. No se conoce la forma de acceso a los datos ni el procedimiento por el cual se emiten las facturas",
        "solution": "CREATE TRIGGER tr_LimiteCreditoCliente\nON Factura\nAFTER INSERT\nAS\nBEGIN\n    IF EXISTS (\n        SELECT 1 FROM inserted i\n        JOIN Cliente c ON i.fact_cliente = c.clie_codigo\n        WHERE (SELECT SUM(fact_total) FROM Factura WHERE fact_cliente = i.fact_cliente AND MONTH(fact_fecha) = MONTH(i.fact_fecha)) > c.clie_limite_credito\n    )\n    BEGIN\n        RAISERROR ('Límite de crédito superado.', 16, 1);\n        ROLLBACK TRANSACTION;\n    END\nEND;",
        "entities": [
            "Cliente",
            "Factura"
        ]
    },
    {
        "id": 19,
        "category": "T-SQL",
        "statement": "Cree el/los objetos de base de datos necesarios para que se cumpla la siguiente regla de negocio automáticamente “Ningún jefe puede tener menos de 5 años de antigüedad y tampoco puede tener más del 50% del personal a su cargo (contando directos e indirectos) a excepción del gerente general”. Se sabe que en la actualidad la regla se cumple y existe un único gerente general.",
        "solution": "CREATE TRIGGER tr_ValidarJefes\nON Empleado\nAFTER UPDATE, INSERT\nAS\nBEGIN\n    -- Validamos para cada jefe afectado en la operación\n    IF EXISTS (\n        SELECT 1 \n        FROM inserted i\n        WHERE \n            -- 1. Regla de antigüedad: Debe tener al menos 5 años\n            (DATEDIFF(YEAR, i.empl_ingreso, GETDATE()) < 5)\n            OR\n            -- 2. Regla del 50% (Excluyendo al gerente general que no tiene jefe)\n            (i.empl_jefe IS NOT NULL AND \n             (SELECT COUNT(*) FROM Empleado WHERE empl_jefe = i.empl_codigo) > \n             (SELECT COUNT(*) * 0.5 FROM Empleado))\n    )\n    BEGIN\n        RAISERROR ('El empleado no cumple con las condiciones para ser jefe (antigüedad o límite de personal).', 16, 1);\n        ROLLBACK TRANSACTION;\n    END\nEND;",
        "entities": [
            "Empleado"
        ]
    },
    {
        "id": 20,
        "category": "T-SQL",
        "statement": "Crear el/los objeto/s necesarios para mantener actualizadas las comisiones del vendedor. El cálculo de la comisión está dado por el 5% de la venta total efectuada por ese vendedor en ese mes, más un 3% adicional en caso de que ese vendedor haya vendido por lo menos 50 productos distintos en el mes.",
        "solution": "CREATE TRIGGER tr_ActualizarComisiones\nON Item_Factura\nAFTER insert\nas\nbegin\n\nDECLARE @vendedor numeric (6,0)\n\nSET @vendedor = (select f.fact_vendedor\n    FROM inserted i\n    JOIN Factura f ON i.item_numero = f.fact_numero\n                   AND i.item_sucursal = f.fact_sucursal\n                   AND i.item_tipo = f.fact_tipo)\n    UPDATE Empleado\n    SET empl_comision = (\n        SELECT \n            SUM(i.item_precio * i.item_cantidad) * 0.05 + \n            CASE WHEN COUNT(DISTINCT i.item_producto) >= 50 THEN SUM(i.item_precio * i.item_cantidad) * 0.03 ELSE 0 END\n        FROM Factura f\n        JOIN Item_Factura i ON f.fact_numero = i.item_numero\n        WHERE f.fact_vendedor = @vendedor\n        AND MONTH(f.fact_fecha) = MONTH(GETDATE())\n         AND YEAR(f.fact_fecha) = YEAR(GETDATE())\n        GROUP BY f.fact_vendedor\n    )\n    WHERE empl_codigo = @vendedor\n\nend",
        "entities": [
            "Factura",
            "Item_factura"
        ]
    },
    {
        "id": 21,
        "category": "T-SQL",
        "statement": "Desarrolle el/los elementos de base de datos necesarios para que se cumpla automaticamente la regla de que en una factura no puede contener productos de diferentes familias. En caso de que esto ocurra no debe grabarse esa factura y debe emitirse un error en pantalla.",
        "solution": "CREATE TRIGGER tr_InsertarFactura\nON Factura\nAFTER INSERT\nAS\nBEGIN\n    if exists\n    (SELECT 1 \n        FROM Producto p\n        JOIN Item_Factura i ON i.item_producto = p.prod_codigo\n        JOIN inserted f on f.fact_numero = i.item_numero\n        and f.fact_tipo = i.item_tipo\n        and f.fact_sucursal = i.item_sucursal\n        group by prod_codigo\n        having count(distinct prod_familia) > 1\n    )\n    begin\n        RAISERROR ('No está permitido comprar en una misma factura distintas familias', 16, 1);\n        ROLLBACK TRANSACTION;\n    end\nend",
        "entities": [
            "Producto",
            "Item_factura"
        ]
    },
    {
        "id": 22,
        "category": "T-SQL",
        "statement": "Se requiere recategorizar los rubros de productos, de forma tal que ningún rubro tenga más de 20 productos asignados, si un rubro tiene más de 20 productos asignados se debera distribuir en otros rubros que no tengan mas de 20 productos y si no entran se debra crear un nuevo rubro en la misma familia con la descripción “RUBRO REASIGNADO”, cree el/los objetos de base de datos necesarios para que dicha regla de negocio quede implementada.",
        "solution": "CREATE PROCEDURE sp_reordenar_rubros\nAS\nBEGIN\n    DECLARE @rubro CHAR(4), @prod CHAR(8);\n    -- Cursor para mover productos de rubros saturados\n    -- (Lógica simplificada: busca rubro > 20 y mueve a otro con < 20)\n    UPDATE Producto SET prod_rubro = (SELECT TOP 1 rubr_id FROM Rubro WHERE (SELECT COUNT(*) FROM Producto WHERE prod_rubro = Rubro.rubr_id) < 20)\n    WHERE prod_rubro IN (SELECT prod_rubro FROM Producto GROUP BY prod_rubro HAVING COUNT(*) > 20);\nEND;",
        "entities": [
            "Rubro",
            "Producto"
        ]
    },
    {
        "id": 23,
        "category": "T-SQL",
        "statement": "Desarrolle el/los elementos de base de datos necesarios para que ante una venta automaticamante se controle que en una misma factura no puedan venderse más de dos productos con composición. Si esto ocurre debera rechazarse la factura.",
        "solution": "CREATE TRIGGER tr_LimiteProductosCompuestos\nON Item_Factura\nAFTER INSERT\nAS\nBEGIN\n    IF EXISTS (\n        SELECT 1\n        FROM Item_Factura i\n        JOIN Composicion c ON i.item_producto = c.comp_producto -- Es compuesto\n        JOIN inserted ins ON i.item_numero = ins.item_numero\n        GROUP BY i.item_numero\n        HAVING COUNT(DISTINCT i.item_producto) > 2\n    )\n    BEGIN\n        RAISERROR ('No se pueden vender más de dos productos compuestos en la misma factura.', 16, 1);\n        ROLLBACK TRANSACTION;\n    END\nEND;",
        "entities": [
            "Item_factura",
            "Composicion"
        ]
    },
    {
        "id": 24,
        "category": "T-SQL",
        "statement": "Se requiere recategorizar los encargados asignados a los depositos. Para ello cree el o los objetos de bases de datos necesarios que lo resueva, teniendo en cuenta que un deposito no puede tener como encargado un empleado que pertenezca a un departamento que no sea de la misma zona que el deposito, si esto ocurre a dicho deposito debera asignársele el empleado con menos depositos asignados que pertenezca a un departamento de esa zona.",
        "solution": "CREATE PROCEDURE sp_reasignar_encargados\nAS\nBEGIN\n    UPDATE Deposito \n    SET depo_encargado = (SELECT TOP 1 e.empl_codigo FROM Empleado e \n                          JOIN Departamento d ON e.empl_departamento = d.depa_codigo \n                          WHERE d.depa_zona = Deposito.depo_zona \n                          ORDER BY (SELECT COUNT(*) FROM Deposito WHERE depo_encargado = e.empl_codigo) ASC)\n    WHERE NOT EXISTS (SELECT 1 FROM Empleado e JOIN Departamento d ON e.empl_departamento = d.depa_codigo \n                      WHERE e.empl_codigo = Deposito.depo_encargado AND d.depa_zona = Deposito.depo_zona);\nEND;",
        "entities": [
            "Empleado",
            "Departamento",
            "Deposito"
        ]
    },
    {
        "id": 25,
        "category": "T-SQL",
        "statement": "Desarrolle el/los elementos de base de datos necesarios para que no se permita que la composición de los productos sea recursiva, o sea, que si el producto A compone al producto B, dicho producto B no pueda ser compuesto por el producto A, hoy la regla se cumple.",
        "solution": "CREATE TRIGGER tr_EvitarRecursividadComposicion\nON Composicion\nAFTER INSERT\nAS\nBEGIN\n    DECLARE @padre CHAR(8), @hijo CHAR(8);\n    \n    -- Capturamos el nuevo registro que se intenta insertar\n    SELECT @padre = comp_producto, @hijo = comp_componente FROM inserted;\n\n    -- 1. Validación de Ciclo Directo (A -> A)\n    IF @padre = @hijo\n    BEGIN\n        RAISERROR ('Error: Un producto no puede ser componente de sí mismo.', 16, 1);\n        ROLLBACK TRANSACTION;\n        RETURN;\n    END\n\n    -- 2. Validación de Ciclo Indirecto (A -> B y B -> A)\n    -- Usamos una tabla en memoria para guardar el árbol de componentes del nuevo 'hijo'\n    DECLARE @ArbolComponentes TABLE (componente CHAR(8));\n\n    ;WITH CTE_Recursiva AS (\n        -- Caso base: los componentes directos del nuevo producto hijo\n        SELECT comp_componente\n        FROM Composicion\n        WHERE comp_producto = @hijo\n        \n        UNION ALL\n        \n        -- Caso recursivo: todos los niveles inferiores\n        SELECT c.comp_componente\n        FROM Composicion c\n        JOIN CTE_Recursiva r ON c.comp_producto = r.componente\n    )\n    INSERT INTO @ArbolComponentes (componente)\n    SELECT componente FROM CTE_Recursiva;\n\n    -- Si el producto padre (el que estamos insertando como origen) \n    -- existe dentro del árbol del hijo, entonces estamos ante una recursividad prohibida.\n    IF EXISTS (SELECT 1 FROM @ArbolComponentes WHERE componente = @padre)\n    BEGIN\n        RAISERROR ('Error: La composición genera una recursividad indirecta (A->B, B->A).', 16, 1);\n        ROLLBACK TRANSACTION;\n    END\nEND;",
        "entities": [
            "Composicion"
        ]
    },
    {
        "id": 26,
        "category": "T-SQL",
        "statement": "Desarrolle el/los elementos de base de datos necesarios para que se cumpla automaticamente la regla de que una factura no puede contener productos que sean componentes de otros productos. En caso de que esto ocurra no debe grabarse esa factura y debe emitirse un error en pantalla.",
        "solution": "CREATE TRIGGER tr_InsertarFactura\nON Item_Factura\nAFTER INSERT\nAS\nBEGIN\n    if exists\n    (SELECT 1 \n        FROM Composicion p\n        JOIN inserted i ON i.item_producto = p.comp_componente\n    )\n    begin\n        RAISERROR ('No está permitido comprar componentes de prodcutos', 16, 1);\n        ROLLBACK TRANSACTION;\n    end\nend",
        "entities": [
            "Composicion"
        ]
    },
    {
        "id": 27,
        "category": "T-SQL",
        "statement": "Se requiere reasignar los encargados de stock de los diferentes depósitos. Para ello se solicita que realice el o los objetos de base de datos necesarios para asignar a cada uno de los depósitos el encargado que le corresponda, entendiendo que el encargado que le corresponde es cualquier empleado que no es jefe y que no es vendedor, o sea, que no está asignado a ningun cliente, se deberán ir asignando tratando de que un empleado solo tenga un deposito asignado, en caso de no poder se irán aumentando la cantidad de depósitos progresivamente para cada empleado.",
        "solution": "CREATE PROCEDURE sp_asignar_encargados_stock\nAS\nBEGIN\n    UPDATE Deposito SET depo_encargado = (\n        SELECT TOP 1 empl_codigo FROM Empleado \n        WHERE empl_jefe IS NOT NULL AND empl_codigo NOT IN (SELECT fact_vendedor FROM Factura)\n        ORDER BY (SELECT COUNT(*) FROM Deposito WHERE depo_encargado = Empleado.empl_codigo) ASC\n    );\nEND;",
        "entities": [
            "Empleado",
            "Factura",
            "Deposito"
        ]
    },
    {
        "id": 28,
        "category": "T-SQL",
        "statement": "Se requiere reasignar los vendedores a los clientes. Para ello se solicita que realice el o los objetos de base de datos necesarios para asignar a cada uno de los clientes el vendedor que le corresponda, entendiendo que el vendedor que le corresponde es aquel que le vendió más facturas a ese cliente, si en particular un cliente no tiene facturas compradas se le deberá asignar el vendedor con más venta de la empresa, o sea, el que en monto haya vendido más.",
        "solution": "CREATE PROCEDURE sp_reasignar_vendedores\nAS\nBEGIN\n    -- 1. Obtenemos al mejor vendedor de la empresa usando una variable\n    DECLARE @mejor_vendedor_empresa NUMERIC(6);\n    \n    SET @mejor_vendedor_empresa = (\n        SELECT TOP 1 fact_vendedor\n        FROM Factura\n        GROUP BY fact_vendedor\n        ORDER BY SUM(fact_total) DESC -- Suma de montos totales\n    );\n\n    -- 2. Actualizamos a todos los clientes\n    UPDATE Cliente\n    SET clie_vendedor = ISNULL(\n        (\n            -- Subconsulta: busca el más frecuente para ESTE cliente\n            SELECT TOP 1 fact_vendedor \n            FROM Factura f\n            WHERE f.fact_cliente = Cliente.clie_codigo\n            GROUP BY f.fact_vendedor\n            ORDER BY COUNT(*) DESC\n        ), \n        @mejor_vendedor_empresa -- Se asigna si el de arriba es NULL\n    );\nEND;",
        "entities": [
            "Factura"
        ]
    },
    {
        "id": 29,
        "category": "T-SQL",
        "statement": "Desarrolle el/los elementos de base de datos necesarios para que se cumpla automaticamente la regla de que una factura no puede contener productos que sean componentes de diferentes productos. En caso de que esto ocurra no debe grabarse esa factura y debe emitirse un error en pantalla.",
        "solution": "CREATE TRIGGER tr_ValidarComponentesDiferentes\nON Item_Factura\nAFTER INSERT\nAS\nBEGIN\n    -- 1. Creamos una tabla temporal para cargar los ítems relevantes\n    CREATE TABLE #ComponentesFactura (\n        factura_id VARCHAR(20),\n        comp_padre CHAR(8)\n    );\n\n    -- 2. Insertamos tanto los ítems existentes como el nuevo en una sola estructura\n    -- Usamos la relación con Composicion para identificar qué producto es componente\n    INSERT INTO #ComponentesFactura (factura_id, comp_padre)\n    SELECT \n        CAST(i.item_tipo AS VARCHAR(1)) + CAST(i.item_sucursal AS VARCHAR(4)) + CAST(i.item_numero AS VARCHAR(8)),\n        c.comp_producto\n    FROM Item_Factura i\n    JOIN Composicion c ON i.item_producto = c.comp_componente\n    WHERE EXISTS (\n        SELECT 1 FROM inserted ins \n        WHERE i.item_numero = ins.item_numero \n          AND i.item_tipo = ins.item_tipo \n          AND i.item_sucursal = ins.item_sucursal\n    );\n\n    INSERT INTO #ComponentesFactura (factura_id, comp_padre)\n    SELECT \n        CAST(ins.item_tipo AS VARCHAR(1)) + CAST(ins.item_sucursal AS VARCHAR(4)) + CAST(ins.item_numero AS VARCHAR(8)),\n        c.comp_producto\n    FROM inserted ins\n    JOIN Composicion c ON ins.item_producto = c.comp_componente;\n\n    -- 3. Validamos si hay más de una familia de productos padre en la misma factura\n    -- Al usar GROUP BY sobre una tabla física temporal, evitamos el sub-select en el FROM\n    IF EXISTS (\n        SELECT factura_id\n        FROM #ComponentesFactura\n        GROUP BY factura_id\n        HAVING COUNT(DISTINCT comp_padre) > 1\n    )\n    BEGIN\n        RAISERROR ('La factura no puede contener componentes de diferentes productos.', 16, 1);\n        ROLLBACK TRANSACTION;\n    END\n\n    -- 4. Limpieza\n    DROP TABLE #ComponentesFactura;\nEND;",
        "entities": [
            "Item_factura",
            "Composicion",
            "If"
        ]
    },
    {
        "id": 30,
        "category": "T-SQL",
        "statement": "Agregar el/los objetos necesarios para crear una regla por la cual un cliente no pueda comprar más de 100 unidades en el mes de ningún producto, si esto ocurre no se deberá ingresar la operación y se deberá emitir un mensaje “Se ha superado el límite máximo de compra de un producto”. Se sabe que esta regla se cumple y que las facturas no pueden ser modificadas.",
        "solution": "CREATE TRIGGER tr_LimiteUnidadesCliente\nON Item_Factura\nAFTER INSERT\nAS\nBEGIN\n    -- 1. Declaramos una variable de tabla para agrupar los datos\n    DECLARE @Acumulado TABLE (\n        cliente CHAR(6),\n        producto CHAR(8),\n        total_cantidad DECIMAL(12,2)\n    );\n\n    -- 2. Insertamos el acumulado mensual de las facturas existentes + el nuevo ítem\n    -- Usamos el cliente de la factura que se está insertando para filtrar\n    INSERT INTO @Acumulado (cliente, producto, total_cantidad)\n    SELECT f.fact_cliente, i.item_producto, SUM(i.item_cantidad)\n    FROM Item_Factura i\n    JOIN Factura f ON i.item_numero = f.fact_numero \n                   AND i.item_tipo = f.fact_tipo \n                   AND i.item_sucursal = f.fact_sucursal\n    WHERE f.fact_cliente IN (\n        SELECT f2.fact_cliente \n        FROM Factura f2 \n        JOIN inserted ins ON f2.fact_numero = ins.item_numero \n                          AND f2.fact_tipo = ins.item_tipo \n                          AND f2.fact_sucursal = ins.item_sucursal\n    )\n\n      AND MONTH(f.fact_fecha) = MONTH(GETDATE()) \n      AND YEAR(f.fact_fecha) = YEAR(GETDATE())\n    GROUP BY f.fact_cliente, i.item_producto;\n\n    -- 3. Verificamos la regla de negocio sobre la variable de tabla\n    IF EXISTS (\n        SELECT 1 \n        FROM @Acumulado \n        WHERE total_cantidad > 100\n    )\n    BEGIN\n        RAISERROR ('Se ha superado el límite máximo de compra de un producto.', 16, 1);\n        ROLLBACK TRANSACTION;\n    END\nEND;",
        "entities": [
            "Item_factura",
            "Factura"
        ]
    },
    {
        "id": 31,
        "category": "T-SQL",
        "statement": "Desarrolle el o los objetos de base de datos necesarios, para que un jefe no pueda tener más de 20 empleados a cargo, directa o indirectamente, si esto ocurre debera asignarsele un jefe que cumpla esa condición, si no existe un jefe para asignarle se le deberá colocar como jefe al gerente general que es aquel que no tiene jefe.",
        "solution": "CREATE TRIGGER tr_ControlLimiteEmpleados\nON Empleado\nAFTER INSERT, UPDATE\nAS\nBEGIN\n    DECLARE @jefe_actual NUMERIC(6);\n    \n    -- Obtenemos el jefe del empleado que acaba de ser insertado/modificado\n    SELECT @jefe_actual = empl_jefe FROM inserted;\n    \n    -- Solo validamos si tiene jefe (si no es NULL, no es el gerente general)\n    IF @jefe_actual IS NOT NULL\n    BEGIN\n        -- Usamos una variable de tabla para contar subordinados (Directos + Indirectos)\n        DECLARE @Subordinados TABLE (id_empl NUMERIC(6));\n        \n        -- Carga recursiva de subordinados (sin SELECT en FROM)\n        INSERT INTO @Subordinados\n        SELECT empl_codigo FROM Empleado WHERE empl_jefe = @jefe_actual;\n        \n        -- Bucle para encontrar niveles indirectos\n        WHILE @@ROWCOUNT > 0\n        BEGIN\n            INSERT INTO @Subordinados\n            SELECT e.empl_codigo \n            FROM Empleado e\n            JOIN @Subordinados s ON e.empl_jefe = s.id_empl\n            WHERE NOT EXISTS (SELECT 1 FROM @Subordinados WHERE id_empl = e.empl_codigo);\n        END\n        \n        -- Si supera los 20, disparamos la reasignación\n        IF (SELECT COUNT(*) FROM @Subordinados) > 20\n        BEGIN\n            EXEC sp_reasignar_jefe @jefe_actual;\n        END\n    END\nEND;\n\nCREATE PROCEDURE sp_reasignar_jefe\n    @jefe_excedido NUMERIC(6)\nAS\nBEGIN\n    DECLARE @nuevo_jefe NUMERIC(6);\n    DECLARE @gerente_general NUMERIC(6);\n    \n    -- Identificamos al gerente (quien no tiene jefe)\n    SELECT @gerente_general = empl_codigo FROM Empleado WHERE empl_jefe IS NULL;\n\n    -- Buscamos un candidato que tenga menos de 20 a cargo\n    -- Nota: Aquí deberíamos aplicar una lógica similar a la del trigger para contar\n    -- pero para simplificar, buscamos un candidato candidato a jefe\n    SELECT TOP 1 @nuevo_jefe = e.empl_codigo\n    FROM Empleado e\n    WHERE e.empl_codigo <> @jefe_excedido\n      AND (SELECT COUNT(*) FROM Empleado WHERE empl_jefe = e.empl_codigo) < 20;\n\n    -- Si no hay candidato, el jefe será el gerente general\n    SET @nuevo_jefe = ISNULL(@nuevo_jefe, @gerente_general);\n\n    -- Actualizamos el jefe de los subordinados del que excedió el límite\n    UPDATE Empleado \n    SET empl_jefe = @nuevo_jefe\n    WHERE empl_jefe = @jefe_excedido;\nEND;",
        "entities": [
            "Empleado"
        ]
    },
    {
        "id": 32,
        "category": "T-SQL",
        "statement": "Hacer un trigger que mantenga actualizado el campo empl_comision de cada empleado con el 10 % de todas las ventas del mes actual.",
        "solution": "ALTER TRIGGER tr_factura ON FACTURA \nAFTER INSERT , UPDATE , DELETE\nAS \nBEGIN TRANSACTION \n\n-- inserted : filas que vienen de la operacion insert \n-- deleted : filas que son borradas \n-- inserted (los nuevos valores modificados) y en deleted los valores viejos \n\n select 'inserted', fact_vendedor,  0.1 * sum(fact_total) from inserted  \n  where year(fact_fecha) = year(getdate()) and \n     month(fact_fecha) = month(getdate())\n group by fact_vendedor \nunion \n select 'deleted', fact_vendedor,  -0.1 * sum(fact_total) from deleted   \n  where year(fact_fecha) = year(getdate()) and \n     month(fact_fecha) = month(getdate())\n group by fact_vendedor \n\n declare @vend numeric(6)\n declare @suma decimal(12,2)\ndeclare mi_cursor CURSOR FOR \n   select  fact_vendedor,  0.1 * sum(fact_total) from inserted  \n    where year(fact_fecha) = year(getdate()) and \n       month(fact_fecha) = month(getdate())\n   group by fact_vendedor \n  union \n   select  fact_vendedor,  -0.1 * sum(fact_total) from deleted   \n    where year(fact_fecha)  = year(getdate()) and \n       month(fact_fecha) = month(getdate())\n   group by fact_vendedor \n \n open mi_cursor \n fetch mi_cursor into @vend , @suma \n \n while @@fetch_status = 0 \n begin \n \n  print '-------------' \n  print @vend \n  print @suma \n  print '-------------' \n \n  update empleado \n   set empl_comision = empl_comision + @suma \n  where empl_codigo = @vend \n  \n  fetch mi_cursor into @vend , @suma  \n end \n \n close mi_cursor \n deallocate mi_cursor \n \nCOMMIT\n\ninsert into factura (fact_tipo, fact_sucursal, fact_numero, fact_fecha, fact_vendedor, fact_total, fact_total_impuestos, fact_cliente )\nvalues ('C', '0001', '00000003', GETDATE(), 1, 1000, 1000, '00000'  )\n\ninsert into factura (fact_tipo, fact_sucursal, fact_numero, fact_fecha, fact_vendedor, fact_total, fact_total_impuestos, fact_cliente )\nvalues ('C', '0001', '00000003', GETDATE(), 1, 2000, 2000, '00000'  )\n\nDELETE factura WHERE fact_tipo = 'C' and  fact_sucursal = '0001' and  fact_numero = '00000003'\n\nupdate factura set fact_total = 10000 where fact_tipo = 'C' and  fact_sucursal = '0001' and  fact_numero = '00000002'\n\nselect * from factura where \nyear(fact_fecha) = year(getdate()) and \nmonth(fact_fecha) = month(getdate()) and \nfact_vendedor = 1 \n\nselect * from empleado",
        "entities": [
            "Factura",
            "Empleado"
        ]
    },
    {
        "category": "Parcial",
        "statement": "-- Parcial 15/11/2022 --\nRealizar una consulta SQL que permita saber los clientes que compraron todos los rubros disponibles del sistema en el 2012.\nDe estos clientes mostrar, siempre para el 2012:\n\t1. El código del cliente.\n\t2. Código del producto que en más cantidades compro.\n\t3. El nombre del producto del punto 2.\n\t4. Cantidad de productos distintos compraros por el cliente.\n\t5. Cantidad de productos con composición comprados por el cliente.\n\nNo está permitido utilizar subconsultas en la clausula FROM, ni recurrir a expresiones de tablas comunes (CTE, es decir WIRH ...)",
        "solution": "select\tf.fact_cliente,\n\t\tc.clie_razon_social,\n\n\t\t(select top 1 i2.item_producto\n\t\t from Item_Factura i2\n\t\t join Factura f2 on f2.fact_tipo+f2.fact_sucursal+f2.fact_numero = i2.item_tipo+i2.item_sucursal+i2.item_numero and f2.fact_cliente=f.fact_cliente\n\t\t where year(f2.fact_fecha)=2012\n\t\t group by i2.item_producto\n\t\t order by sum(i2.item_cantidad) desc) as 'Cod_Producto_Mas_Comprado',\n\n\t\t (select top 1 p.prod_detalle\n\t\t from Item_Factura i2\n\t\t join Factura f2 on f2.fact_tipo+f2.fact_sucursal+f2.fact_numero = i2.item_tipo+i2.item_sucursal+i2.item_numero and f2.fact_cliente=f.fact_cliente\n\t\t join Producto p on p.prod_codigo=i2.item_producto\n\t\t where year(f2.fact_fecha)=2012\n\t\t group by i2.item_producto, p.prod_detalle\n\t\t order by sum(i2.item_cantidad) desc) as 'Producto_Mas_Comprado',\n\t\t\n\t\t count(distinct i.item_producto) as 'Productos_Distintos_Comprados',\n\n\t\t (select isnull(sum(i2.item_cantidad),0)\n\t\t  from Item_Factura i2\n\t\t  join Factura f2 on f2.fact_tipo+f2.fact_sucursal+f2.fact_numero = i2.item_tipo+i2.item_sucursal+i2.item_numero and f2.fact_cliente=f.fact_cliente\n\t\t  where year(f2.fact_fecha)=2012 and i2.item_producto in (select c.comp_producto from Composicion c)) \n\t\t\t\t\nfrom Factura f\njoin Cliente c on f.fact_cliente=c.clie_codigo\njoin Item_Factura i on f.fact_tipo+f.fact_sucursal+f.fact_numero = i.item_tipo+i.item_sucursal+i.item_numero\nwhere year(f.fact_fecha)=2012\ngroup by f.fact_cliente, c.clie_razon_social\nhaving sum(i.item_cantidad*i.item_precio) >  (select avg(f2.fact_total)\n\t\t\t\t\t      from Factura f2\n\t\t\t\t\t      where year(f2.fact_fecha)=2012\n\t\t\t\t\t      )\norder by case when count(distinct i.item_producto) between 5 and 10 then 1 else 0 end desc\n\n--- Solución Alternativa ---\nselect f.fact_cliente as codigo_cliente,\n\n(select top 1 i2.item_producto from factura f2 join Item_Factura i2 on i2.item_sucursal = f2.fact_sucursal\n                                                             and i2.item_tipo = f2.fact_tipo\n                                                             and i2.item_numero = f2.fact_numero\nwhere year(f2.fact_fecha) = 2012 and f2.fact_cliente = f.fact_cliente\ngroup by i2.item_producto order by sum(i2.item_cantidad) desc) as producto_mas_compro,\n\n (select top 1 p3.prod_detalle from factura f2 join Item_Factura i2 on i2.item_sucursal = f2.fact_sucursal\n                                                             and i2.item_tipo = f2.fact_tipo\n                                                             and i2.item_numero = f2.fact_numero\n                                join Producto p3 on p3.prod_codigo = i2.item_producto\nwhere year(f2.fact_fecha) = 2012 and f2.fact_cliente = f.fact_cliente\ngroup by p3.prod_detalle order by sum(i2.item_cantidad) desc) as nombre_producto,\n\ncount(distinct i.item_producto) as cantidada_diferentes_productos,\n\n(select count(distinct i3.item_producto) from factura f3 join item_factura i3 on f3.fact_numero = i3.item_numero\n                                                     and f3.fact_sucursal = i3.item_sucursal\n                                                     and f3.fact_tipo = i3.item_tipo\ninner join Composicion c3 on c3.comp_producto = i3.item_producto\nwhere year(f3.fact_fecha) = 2012 and f3.fact_cliente = f.fact_cliente) as cantidad_composicion\n\nfrom factura f join Item_Factura i on i.item_sucursal = f.fact_sucursal\n                                   and i.item_tipo = f.fact_tipo\n                                   and i.item_numero = f.fact_numero\n                join Producto p on i.item_producto = p.prod_codigo\n                join cliente cl on cl.clie_codigo = f.fact_cliente\nwhere year(f.fact_fecha)= 2012 and f.fact_cliente in (select f5.fact_cliente from Factura f5 join Item_Factura i5 on i5.item_sucursal = f5.fact_sucursal\n                                                                                                            and i5.item_tipo = f5.fact_tipo\n                                                                                                            and i5.item_numero = f5.fact_numero\n                    join Producto p5 on p5.prod_codigo = i5.item_producto  where year(f5.fact_fecha) = 2012 \n                    group by f5.fact_cliente having COUNT(distinct p5.prod_rubro) = (select count(*) from rubro))\ngroup by f.fact_cliente,cl.clie_razon_social order by cl.clie_razon_social ASC, \n--le pedi a ia por paja , pero ya estaba terminado\n    CASE \n        WHEN (SUM(f.fact_total) * 100.0 / (SELECT SUM(fact_total) FROM Factura WHERE YEAR(fact_fecha) = 2012)) \n             BETWEEN 20 AND 30 \n        THEN 0 \n        ELSE 1 \n    END ASC",
        "entities": [
            "Factura",
            "Cliente",
            "Item_Factura",
            "Producto",
            "Composicion"
        ],
        "id": 1
    },
    {
        "category": "Parcial",
        "statement": "-- Parcial 28/06/2025 --\nEl objetivo es realizar una consulta SQL que identifique a los clientes que compraron productos que pertenezcan a dos rankings distintos del año 2012:\n\t- Los productos más vendidos en 2012.\n\t- Los productos menos vendidos en 2012 (considerando únicamente los 10 productos con menor cantidad vendida, incluso si hay más de 10 productos con el mismo valor mínimo).\nLa consulta debe devolver los siguientes datos:\n\t1. El número de fila (orden correlativo).\n\t2. El nombre del cliente.\n\t3. Si es cliente en el Ranking de los más vendidos.\n\t4. Cantidad total de Facturas del cliente.\nEl resultado debe estar ordenado en forma descendente según el monto total de compras del cliente (de mayor a menor).\n\nNo está permitido utilizar subconsultas en la clausula FROM, ni recurrir a expresiones de tablas comunes (CTE, es decir WIRH ...)",
        "solution": "SELECT \n\tROW_NUMBER() OVER(ORDER BY SUM(i.item_precio * i.item_cantidad)) AS Número_de_Fila,\n\tc.clie_razon_social AS Cliente,\n\t(CASE WHEN EXISTS (SELECT TOP 10\n\t\t\t\t\t\t\t1\n\t\t\t\t\t\tFROM Factura f2 \n\t\t\t\t\t\tJOIN Item_Factura i2 ON f2.fact_sucursal = i2.item_sucursal AND\n\t\t\t\t\t\t\t\t\t\t\t\tf2.fact_numero = i2.item_numero AND \n\t\t\t\t\t\t\t\t\t\t\t\tf2.fact_tipo = i2.item_tipo\n\t\t\t\t\t\tWHERE f2.fact_cliente = f.fact_cliente AND\n\t\t\t\t\t\t\ti2.item_producto IN (SELECT TOP 10\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ti3.item_producto\n\t\t\t\t\t\t\t\t\t\t\t\t\tFROM Factura f3 \n\t\t\t\t\t\t\t\t\t\t\t\t\tJOIN Item_Factura i3 ON f3.fact_sucursal = i3.item_sucursal AND\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tf3.fact_numero = i3.item_numero AND \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tf3.fact_tipo = i3.item_tipo\n\t\t\t\t\t\t\t\t\t\t\t\t\tWHERE YEAR(f3.fact_fecha) = 2012\n\t\t\t\t\t\t\t\t\t\t\t\t\tGROUP BY i3.item_producto\n\t\t\t\t\t\t\t\t\t\t\t\t\tORDER BY SUM(i3.item_cantidad) DESC))\n\t      THEN 'Si'\n\t\t  ELSE 'No'\n\t END) AS Es_Cliente_de_los_más_Vendidos,\n\t(SELECT \n\t     COUNT(*)\n\t FROM Factura f2\n\t WHERE f2.fact_cliente = f.fact_cliente) AS Cant_de_Facturas\nFROM Factura f\nJOIN Cliente c ON f.fact_cliente = c.clie_codigo\nJOIN Item_Factura i ON f.fact_sucursal = i.item_sucursal AND\n\t\t\t           f.fact_numero = i.item_numero AND \n\t\t\t\t\t   f.fact_tipo = i.item_tipo\nWHERE EXISTS (SELECT TOP 10\n\t\t\t\t  1\n\t\t\t  FROM Factura f2 \n\t\t\t  JOIN Item_Factura i2 ON f2.fact_sucursal = i2.item_sucursal AND\n\t\t\t\t\t\t\t\t      f2.fact_numero = i2.item_numero AND \n\t\t\t\t\t\t\t\t      f2.fact_tipo = i2.item_tipo\n\t\t\t  WHERE f2.fact_cliente = f.fact_cliente AND\n\t\t\t\t    i2.item_producto IN (SELECT TOP 10\n\t\t\t\t\t\t\t\t\t\t\t i3.item_producto\n\t\t\t\t\t\t\t\t\t\t FROM Factura f3 \n\t\t\t\t\t\t\t\t\t\t JOIN Item_Factura i3 ON f3.fact_sucursal = i3.item_sucursal AND\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t f3.fact_numero = i3.item_numero AND \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t f3.fact_tipo = i3.item_tipo\n\t\t\t\t\t\t\t\t\t\t WHERE YEAR(f3.fact_fecha) = 2012\n\t\t\t\t\t\t\t\t\t\t GROUP BY i3.item_producto\n\t\t\t\t\t\t\t\t\t\t ORDER BY SUM(i3.item_cantidad) DESC) OR\n\t\t\t\t\ti2.item_producto IN (SELECT TOP 10\n\t\t\t\t\t\t\t\t\t\t\t i3.item_producto\n\t\t\t\t\t\t\t\t\t\t FROM Factura f3 \n\t\t\t\t\t\t\t\t\t\t JOIN Item_Factura i3 ON f3.fact_sucursal = i3.item_sucursal AND\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t f3.fact_numero = i3.item_numero AND \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t f3.fact_tipo = i3.item_tipo\n\t\t\t\t\t\t\t\t\t\t WHERE YEAR(f3.fact_fecha) = 2012\n\t\t\t\t\t\t\t\t\t\t GROUP BY i3.item_producto\n\t\t\t\t\t\t\t\t\t\t ORDER BY SUM(i3.item_cantidad) ASC)) \n      \nGROUP BY f.fact_cliente, c.clie_razon_social\nORDER BY SUM(i.item_precio * i.item_cantidad) DESC",
        "entities": [
            "Factura",
            "Cliente",
            "Item_Factura"
        ],
        "id": 2
    },
    {
        "category": "Parcial",
        "statement": "-- Parcial 20/09/2025 --\nEsta resolucion fue hecha por el profesor Lacquaniti y esta incompleta en muchos sentidos.\nCrear una consulta SQL que identifique los 10 primeros productos que, durante tres años consecutivos, hayan registrado en cada año un incremento minimo del 20% en sus cantidades vendidas respecto al año anterior.\nDe los productos seleccionados mostrar únicamente aquellos que actualmente dispongan de stock en al menos el 75% de los depósitos.\n\nLos datos a mostrar por cada producto que cumpla con la consiga son:\n    1. Nombre del producto.\n    2. Fecha de ultima compra del producto.\n    3. Cantidad de clientes que lo compraron en el 2025.\n\nNo está permitido utilizar subconsultas en la clausula FROM, ni recurrir a expresiones de tablas comunes (CTE, es decir WITH ...)",
        "solution": "select *\nfrom Producto p --join\nwhere exists(select 1 \n\t\t\t from factura f1 \n\t\t\t\tjoin Item_Factura i1 on i1.item_numero+i1.item_sucursal+i1.item_tipo = f1.fact_numero+f1.fact_sucursal+f1.fact_tipo\n             where i1.item_producto = p.prod_codigo\n             group by i1.item_producto, year(f1.fact_fecha)\n             having sum(i1.item_cantidad) < 1.2 * (select sum(i2.item_cantidad)\n\t\t\t\t\t\t\t\t\t\t\t\t   from Factura f2 \n\t\t\t\t\t\t\t\t\t\t\t\t\tjoin Item_Factura i2 on i2.item_numero+i2.item_sucursal+i2.item_tipo = f2.fact_numero+f2.fact_sucursal+f2.fact_tipo\n\t\t\t\t\t\t\t\t\t\t\t\t   where i2.item_producto = p.prod_codigo\n\t\t\t\t\t\t\t\t\t\t\t\t   group by i2.item_producto, year(f2.fact_fecha)\n\t\t\t\t\t\t\t\t\t\t\t\t   having year(f.fact_fecha) + 1 = year(f2.fact_fecha)\n\t\t\t\t\t\t\t\t\t\t\t\t   and sum(i.item_cantidad) < 1.2 (select sum (i3.item_cantidad) \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t   from Factura f3 \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tjoin Item_Factura i3 on i3.item_numero+i3.item_sucursal+i3.item_tipo = f3.fact_numero+f3.fact_sucursal+f3.fact_tipo\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t   where i3.item_producto = p.prod_codigo\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t   group by i3.item_producto, year(f3.fact_fecha)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t   having year(f2.fact_fecha)+1 = year(f3.fact_fecha))\nand ((select count() \n\t  from DEPOSITO) * 0.75 <= (select count(1) \n\t  from STOCK \n\t  where stoc_producto = prod_codigo \n\t\tand stoc_cantidad > 0)\n\nselect\n(select max(f2.fact_fecha) \nfrom Factura f2 \n\tjoin Item_Factura i2 on i2.item_numero+i2.item_sucursal+i2.item_tipo = f2.fact_numero+f2.fact_sucursal+f2.fact_tipo\nwhere i2.item_producto = p.prod_codigo), (select count(distinct fact_cliente) from Factura join\nwhere i2. item_producto = p.prod_codigo)",
        "entities": [
            "Producto",
            "Factura",
            "Item_Factura",
            "STOCK",
            "DEPOSITO"
        ],
        "id": 3
    },
    {
        "category": "Parcial",
        "statement": "-- Parcial 2c - 2017\nRealizar una consulta sql que retorne, para cada producto con mas de 2 articulos distintos en su composicion la siguiente informacion\n-Detalle del producto\n- Rubro del producto\n- Cantidad de veces que fue vendido\nEl resultado debera mostrar ordenado por la cantidad de los productos que lo componen.",
        "solution": "select\n  p.prod_detalle,\n  r.rubr_detalle,\n  (select count(*) from item_factura where item_producto = p.prod_codigo) cantidad_ventas\nfrom producto p\njoin rubro r on p.prod_rubro = r.rubr_id\nwhere\n  p.prod_codigo in\n    (select c.comp_producto from composicion c group by c.comp_producto having count(comp_componente) > 2) -- cambiar por >= para que me muestre algo\norder by (select sum(comp_cantidad) from composicion where comp_producto = p.prod_codigo) desc -- cantidad de componentes, en su cantidad correspondiente\ngo",
        "entities": [
            "Producto",
            "Rubro",
            "Item_Factura",
            "Composicion"
        ],
        "id": 4
    },
    {
        "category": "Parcial",
        "statement": "28/06/2025\nSe desea crear una vista denominada v_item_factura que permita visualizar, para cada item de una factura, la identificacion de la factura, el nombre del producto, el precio unitario, la cantidad y el total correspondiente a ese item.\n\nSin embargo, se solicita eliminar fisicamente los campos item_precio e item_total de la tabla item_factura, ya que se considera que dichos valores no deben almacenarse más en esa tabla. Ademas, no está permitido agregar nuevos campos a item_factura.\n\n¿Que deberia implementarse para que la vista v_item_factura pueda mostrar en todo momento la informacion requerida, tanto para los datos actuales como para los futuros?",
        "solution": "------------------------RESOLUCIÓN\n-- Creo la nueva tabla para guardar item_precio e item_total\nCREATE TABLE Item_Factura_Precio (\n\titem_precio_producto CHAR(8),\n\titem_precio_tipo CHAR(1),\n\titem_precio_sucursal CHAR(4),\n\titem_precio_numero CHAR(8),\n\titem_precio_precio DECIMAL(12,2),\n\titem_precio_total DECIMAL(12,2)\n\n\tFOREIGN KEY(item_precio_producto) REFERENCES Producto(prod_codigo),\n\tFOREIGN KEY(item_precio_tipo, item_precio_sucursal, item_precio_numero) \n\tREFERENCES Factura(fact_tipo, fact_sucursal, fact_numero)\n)\ngo\n\n-- Procedure para cargar la nueva tabla con los datos actuales\nCREATE PROCEDURE sp_Cargar_Item_Factura_Precio\nAS\nBEGIN\n\tINSERT INTO Item_Factura_Precio (item_precio_producto,\n\t\t\t\t\t\t\t\t\t item_precio_tipo,\n\t\t\t\t\t\t\t\t\t item_precio_sucursal,\n\t\t\t\t\t\t\t\t\t item_precio_numero,\n\t\t\t\t\t\t\t\t\t item_precio_precio,\n\t\t\t\t\t\t\t\t\t item_precio_total)\n\tSELECT\n\t\titem_producto,\n\t\titem_tipo,\n\t\titem_sucursal,\n\t\titem_numero,\n\t\titem_precio,\n\t\titem_precio * item_cantidad\n\tFROM Item_Factura\nEND\ngo\n\n-- Cargo la nueva tabla\nEXEC sp_Cargar_Item_Factura_Precio\ngo\n\n-- Elimino el campo item_precio\nALTER TABLE Item_Factura DROP COLUMN item_precio\ngo\n\n-- Trigger para cargar datos a futuro\nCREATE TRIGGER tr_Cargar_Item_Factura_Precio\nON Item_Factura\nAFTER INSERT \nAS\nBEGIN\n\tINSERT INTO Item_Factura_Precio (item_precio_producto,\n\t\t\t\t\t\t\t\t\titem_precio_tipo,\n\t\t\t\t\t\t\t\t\titem_precio_sucursal,\n\t\t\t\t\t\t\t\t\titem_precio_numero,\n\t\t\t\t\t\t\t\t\titem_precio_precio,\n\t\t\t\t\t\t\t\t\titem_precio_total)\n\tSELECT\n\t\ti.item_producto,\n\t\ti.item_tipo,\n\t\ti.item_sucursal,\n\t\ti.item_numero,\n\t\tp.prod_precio,\n\t\tp.prod_precio * i.item_cantidad\n\tFROM inserted i\n\tJOIN Producto p\n\t\tON i.item_producto = p.prod_codigo\nEND\ngo\n\n-- Creo la vista con los datos actuales y los futuros que se insertar n en la nueva tabla\nCREATE VIEW v_item_factura \nAS\nSELECT\n\tCONCAT(i.item_numero, '-', i.item_sucursal, '-', i.item_tipo) AS id_Factura,\n\tp.prod_detalle AS nombre,\n\tifp.item_precio_precio AS precio_unitario,\n\ti.item_cantidad AS cantidad,\n\tifp.item_precio_total AS total\nFROM Item_Factura i\nJOIN Producto p\n\tON i.item_producto = p.prod_codigo\nJOIN Item_Factura_Precio ifp\n\tON ifp.item_precio_tipo = i.item_tipo\n\tAND ifp.item_precio_sucursal = i.item_sucursal\n\tAND ifp.item_precio_numero = i.item_numero\n\tAND ifp.item_precio_producto = i.item_producto\nGROUP BY CONCAT(i.item_numero, '-', i.item_sucursal, '-', i.item_tipo), \n\t\t p.prod_detalle, ifp.item_precio_precio, i.item_cantidad, ifp.item_precio_total\ngo",
        "entities": [
            "Item_Factura_Precio",
            "Producto",
            "Factura",
            "Item_Factura"
        ],
        "id": 5
    },
    {
        "category": "Parcial",
        "statement": "25/06/2024\nDado el contexto inflacionario se tiene que aplicar un control en el cual nunca se permita vender un producto a un precio que no esté entre +0%-5% del precio de venta del producto el mes anterior, ni tampoco que esté en más de un 50% el precio del mismo producto que hace 12 meses atrás. Aquellos productos nuevos, o que no tuvieron ventas en meses anteriores no debe considerar esta regla ya que no hay precio de referencia.",
        "solution": "------------------------RESOLUCIÓN\nCREATE TRIGGER unTrigger ON Item_Factura\nFOR insert --se ejecuta despues de realizarse un insert en Item_Factura\nAS BEGIN\n\t--declaracion de variables, seran usados para recorrer y comparar los datos insertados\n    DECLARE \n\t\t@PROD char(6), --codigo producto \n\t\t@FECHA SMALLDATETIME, --fecha de venta\n\t\t@PRECIO decimal(12,2), --precio de la venta\n\t\t--factura\n\t\t@SUCURSAL char(4),\n\t\t@NUM char(8), \n\t\t@TIPO char(1)\n\t--declaracion del curso, recorre cada factura insertada\n    DECLARE c1 CURSOR FOR\n\t\tselect fact_numero, fact_sucursal, fact_tipo \n\t\t\tfrom inserted --solo recorre las recien insertadas\n\t\t\t\tjoin Factura on fact_numero+fact_sucursal+fact_tipo = item_numero+item_sucursal+item_tipo\n\n\tOPEN c1 --abre cursos\n\tFETCH NEXT FROM c1 INTO  @NUM, @SUCURSAL ,@TIPO --busca por factura\n\n\tWHILE @@FETCH_STATUS = 0\n\tBEGIN\n\t\t--declaracion de un segundo cursor, recorre los items de la factura en la que se encuentra posiciona\n\t    DECLARE c2 CURSOR FOR \n\t\t\tselect item_producto, fact_fecha, item_precio \n\t\t\t\tfrom inserted --recorre los items recien insertados\n\t\t\t\t\tjoin Factura on fact_numero+fact_sucursal+fact_tipo = item_numero+item_sucursal+item_tipo\n\t\t\t\twhere fact_numero+fact_sucursal+fact_tipo = @NUM + @SUCURSAL + @TIPO\n\n\t\tOPEN c2 --abre cursor\n\t\tFETCH NEXT FROM c2 INTO @PROD, @FECHA, @PRECIO --Busca por producto, precio y fecha\n\n\t\tWHILE @@FETCH_STATUS = 0\n\t\tBEGIN\n\t\t      IF EXISTS(\n\t\t\t\tselect 1 \n\t\t\t\tfrom Item_Factura \n\t\t\t\twhere item_producto = @PROD \n\t\t\t\t\tand item_numero+item_sucursal+item_tipo <> @NUM+@SUCURSAL+@TIPO\n\t\t\t\t)\n\t\t\t  BEGIN \n\t\t\t\t\t--Comparacion mensual\n\t\t\t        IF EXISTS(\n\t\t\t\t\t\tselect 1 \n\t\t\t\t\t\tfrom Item_Factura \n\t\t\t\t\t\t\tjoin Factura on fact_numero+fact_sucursal+fact_tipo = item_numero+item_sucursal+item_tipo\n\t\t\t\t\t\twhere item_producto = @PROD \n\t\t\t\t\t\t\tand DATEDIFF(MONTH, @FECHA, fact_fecha) = 1 \n\t\t\t\t\t\t\tand @PRECIO > item_precio * 1.05\n\t\t\t\t\t\t)\n\t                BEGIN --Si el precio subio mas de un 5% en un mes elimina la factura recien insertada \n\t\t               Delete Item_Factura\n\t\t\t           where item_numero = @NUM\n\t\t\t\t\t   \t\tand item_sucursal = @SUCURSAL \n\t\t\t\t\t\t\tand item_tipo = @TIPO\n\n\t\t\t           Delete Factura\n\t\t\t           where fact_numero = @NUM \n\t\t\t\t\t\t\tand fact_sucursal = @SUCURSAL \n\t\t\t\t\t\t\tand fact_tipo = @TIPO\n\n\t\t\t\t    CLOSE c2\n\t\t\t\t    DEALLOCATE c2\n\t\t\t        END\n\t\t\t\t\t--Comparacion anual\n\t\t\t       IF EXISTS(\n\t\t\t\t\t\tselect 1 \n\t\t\t\t\t\tfrom Item_Factura \n\t\t           \t\t\tjoin Factura on fact_numero+fact_sucursal+fact_tipo = item_numero+item_sucursal+item_tipo\n\t\t           \t\twhere item_producto = @PROD \n\t\t\t\t\t\t\tand DATEDIFF(YEAR, @FECHA, fact_fecha) = 1 \n\t\t\t\t\t\t\tand @PRECIO > item_precio * 1.5\n\t\t\t\t\t\t)\n\t               BEGIN --Si el precio subio más de un 50% en un año, elimina la factura recien insertada\n\t\t              Delete Item_Factura\n\t\t\t          where item_numero = @NUM \n\t\t\t\t\t  \t\tand item_sucursal = @SUCURSAL \n\t\t\t\t\t\t\tand item_tipo = @TIPO\n\n\t\t\t          Delete Factura\n\t\t\t          where fact_numero = @NUM \n\t\t\t\t\t  \t\tand fact_sucursal = @SUCURSAL \n\t\t\t\t\t\t\tand fact_tipo = @TIPO\n\n\t\t\t\t   CLOSE c2 --cierra cursor\n\t\t\t\t   DEALLOCATE c2 --libera memoria\n\t\t\t       END\n\t\t\t  END\n\n\t\t      FETCH NEXT FROM c2 INTO @PROD, @FECHA, @PRECIO --toma el siguiente en la fila\n\t\tEND\n\t\t\n\t    FETCH NEXT FROM c1 INTO @PROD, @FECHA, @PRECIO, @NUM, @SUCURSAL ,@TIPO   \n\tEND\n\n\tCLOSE c1\n\tDEALLOCATE c1\nEND\ngo",
        "entities": [
            "Item_Factura",
            "Factura"
        ],
        "id": 6
    },
    {
        "category": "Parcial",
        "statement": "-- Parcial 2C - 2017\nAgregar el/los objetos necesarios para que se permita mantener la siguiente restriccion:\n- Nunca un jefe va a poder tener mas de 20 personas a cargo y menos de 1.\nConsiderar solo 1 nivel de la relacion empleado-jefe",
        "solution": "CREATE TRIGGER tr_empleados ON Empleado\nAFTER INSERT, UPDATE, DELETE\nAS\n    BEGIN TRANSACTION\n        IF((SELECT COUNT(*) FROM inserted i) > 0) --Significa que es un INSERT / UPDATE\n            BEGIN\n                IF(EXISTS(SELECT 1 FROM inserted WHERE dbo.cant_personas_a_cargo(empl_jefe) < 1))\n                    BEGIN\n                        RAISERROR('Un jefe no puede tener menos de una persona a cargo.', 16, 1)\n                        ROLLBACK\n                        RETURN\n                    END\n                IF(EXISTS(SELECT 1 FROM inserted WHERE dbo.cant_personas_a_cargo(empl_jefe) > 20))\n                    BEGIN\n                        RAISERROR('Un jefe no puede tener más de 20 personas a cargo.', 16, 1)\n                        ROLLBACK\n                        RETURN\n                    END\n            END\n        ELSE --Es un DELETE\n            BEGIN\n                IF(EXISTS(SELECT 1 FROM deleted WHERE dbo.cant_personas_a_cargo(empl_jefe) < 1))\n                    BEGIN\n                        RAISERROR('Un jefe no puede tener menos de una persona a cargo.', 16, 1)\n                        ROLLBACK\n                        RETURN\n                    END\n            END\n        COMMIT TRANSACTION\nGO",
        "entities": [
            "Empleado"
        ],
        "id": 7
    },
    {
        "category": "Parcial",
        "statement": "1. Consulta SQL para analizar clientes con patrones de compra\nespecíficos:\nSe debe Identificar clientes que realizaron una compra inicial y luego\nvolvieron a comprar después de 5 meses o más.\nLa consulta debe mostrar:\n1. Número de fila: Identificador secuencial del resultado.\n2. Código del cliente: ID único del cliente.\n3. Nombre del cliente: Nombre asociado al cliente.\n4. Cantidad total comprada: Total de productos distintos adquiridos por el\ncliente.\n5. Total facturado: Importe total facturado al cliente.\nEl resultado debe estar ordenado de forma descendente por la cantidad de\nproductos adquiridos por cada cliente.",
        "solution": "select \nrow_number() over (order by count(distinct item_producto)  desc) as numero_fila, \nfact_cliente, \nclie_razon_social,\ncount(distinct item_producto) as productos_comprados,\nsum (item_cantidad*item_precio)  as total_facturado\nfrom Factura f\njoin Cliente on fact_cliente = clie_codigo\t\njoin Item_Factura on fact_numero = item_numero\nand fact_tipo = item_tipo\nand fact_sucursal = item_sucursal\ngroup by fact_cliente, clie_razon_social\nhaving count(fact_numero) >= 2\n AND NOT EXISTS (\n        SELECT 1\n        FROM Factura F3\n        WHERE F3.fact_cliente = f.fact_cliente\n          AND F3.fact_fecha > (SELECT MIN(F4.fact_fecha)\n                               FROM Factura F4\n                               WHERE F4.fact_cliente = fact_cliente)\n          AND DATEDIFF(\n                MONTH,\n                (SELECT MIN(F4.fact_fecha)\n                 FROM Factura F4\n                 WHERE F4.fact_cliente = f.fact_cliente),\n                F3.fact_fecha\n          ) < 5\n    )\norder by count(distinct item_producto)  desc;\n\n/*\n\n*/\n\nSelect * from Factura\nwhere fact_cliente = '01772' or fact_cliente = '01634'",
        "entities": [
            "Factura",
            "Cliente",
            "Item_Factura"
        ],
        "id": 8
    },
    {
        "category": "Parcial",
        "statement": "Ejercicio de practica sin resultado 1C2018\nSe necesita saber que productos no son vendidos durante el 2018 y cuáles sí. La consulta debe mostrar:\na) código de producto\nb) Nombre de producto\nc) Fue vendido (si o no) según el caso\nd) cantidad de componentes\nEL resultado debe ser ordenado por cantidad total vendida\nNota: no se permite el uso de sub-selects en el FROM ni funciones definidas por el usuario\nAclaracion: se realiza con la base de práctica de la cátedra, en lugar de 2018 se puede usar otro año para testearla",
        "solution": "SELECT p.prod_codigo, p.prod_detalle,\n       CASE WHEN EXISTS (SELECT 1 FROM Item_Factura i \n                         JOIN Factura f ON i.item_numero = f.fact_numero AND i.item_sucursal = f.fact_sucursal AND i.item_tipo = f.fact_tipo\n                         WHERE i.item_producto = p.prod_codigo AND YEAR(f.fact_fecha) = 2018) \n            THEN 'Si' ELSE 'No' END AS Fue_Vendido,\n       (SELECT COUNT(*) FROM Composicion WHERE comp_producto = p.prod_codigo) AS Cant_Componentes\nFROM Producto p\nORDER BY (SELECT ISNULL(SUM(i.item_cantidad),0) FROM Item_Factura i \n          JOIN Factura f ON i.item_numero = f.fact_numero AND i.item_sucursal = f.fact_sucursal AND i.item_tipo = f.fact_tipo\n          WHERE i.item_producto = p.prod_codigo)",
        "entities": [
            "Producto",
            "Item_Factura",
            "Factura",
            "Composicion"
        ],
        "id": 9
    },
    {
        "category": "Parcial",
        "statement": "Ejercicio practica sin resultado 1C2018\nimplementar el/los objetos necesarios para mantener siempre actualizado al instante ante cualquier evento el campo fact_total de la tabla Factura\nNota: se sabe que actualmente el campo fact_total presenta esta propiedad",
        "solution": "CREATE TRIGGER tr_Actualizar_FactTotal ON Item_Factura\nAFTER INSERT, UPDATE, DELETE\nAS\nBEGIN\n    -- Actualiza facturas afectadas por cambios en items\n    UPDATE Factura SET fact_total = (SELECT SUM(item_cantidad * item_precio) \n                                     FROM Item_Factura \n                                     WHERE item_numero = Factura.fact_numero \n                                     AND item_sucursal = Factura.fact_sucursal \n                                     AND item_tipo = Factura.fact_tipo)\n    WHERE fact_numero IN (SELECT item_numero FROM inserted UNION SELECT item_numero FROM deleted)\nEND",
        "entities": [
            "Item_Factura",
            "Factura"
        ],
        "id": 10
    },
    {
        "category": "Parcial",
        "statement": "Parcial 28/06/2023 sin resultado\nRealizar una consulta sql que devuelva todos los clientes que durante 2 años consecutivos compraron al menos 5 productos distintos. De esos clientes mostrar:\n- El codigo de cliente\n- El monto total comprado en el 2012\n- La cantidad de unidades de productos compradas en el 2012\nEl resultado debe ser ordenado primero por aquellos clientes que compraron solo productos compuestos en algun momento, luego el resto.",
        "solution": "SELECT \n    f.fact_cliente,\n    SUM(CASE WHEN YEAR(f.fact_fecha) = 2012 THEN f.fact_total ELSE 0 END) AS Monto_Total_2012,\n    SUM(CASE WHEN YEAR(f.fact_fecha) = 2012 THEN i.item_cantidad ELSE 0 END) AS Cantidad_Unidades_2012\nFROM Factura f\nJOIN Item_Factura i ON f.fact_numero = i.item_numero \n    AND f.fact_sucursal = i.item_sucursal \n    AND f.fact_tipo = i.item_tipo\nWHERE EXISTS (\n    -- Condición: 2 años consecutivos con al menos 5 productos distintos\n    SELECT 1 \n    FROM Factura f1\n    JOIN Item_Factura i1 ON f1.fact_numero = i1.item_numero \n        AND f1.fact_sucursal = i1.item_sucursal \n        AND f1.fact_tipo = i1.item_tipo\n    WHERE f1.fact_cliente = f.fact_cliente\n    GROUP BY f1.fact_cliente, YEAR(f1.fact_fecha)\n    HAVING COUNT(DISTINCT i1.item_producto) >= 5\n    AND EXISTS (\n        SELECT 1 FROM Factura f2\n        JOIN Item_Factura i2 ON f2.fact_numero = i2.item_numero \n            AND f2.fact_sucursal = i2.item_sucursal \n            AND f2.fact_tipo = i2.item_tipo\n        WHERE f2.fact_cliente = f.fact_cliente\n        AND YEAR(f2.fact_fecha) = YEAR(f1.fact_fecha) + 1\n        GROUP BY YEAR(f2.fact_fecha)\n        HAVING COUNT(DISTINCT i2.item_producto) >= 5\n    )\n)\nGROUP BY f.fact_cliente\nORDER BY \n    -- Orden: Primero los que compraron SOLO productos compuestos en algún momento\n    CASE WHEN NOT EXISTS (\n        SELECT 1 \n        FROM Factura f3\n        JOIN Item_Factura i3 ON f3.fact_numero = i3.item_numero \n            AND f3.fact_sucursal = i3.item_sucursal \n            AND f3.fact_tipo = i3.item_tipo\n        WHERE f3.fact_cliente = f.fact_cliente\n        AND i3.item_producto NOT IN (SELECT comp_producto FROM Composicion)\n    ) THEN 0 ELSE 1 END ASC",
        "entities": [
            "Factura",
            "Item_Factura",
            "Composicion"
        ],
        "id": 11
    },
    {
        "category": "Parcial",
        "statement": "Enunciado T-SQL (lo tomó en otro parcial)\nSe requiere mantener precalculada toda la información relacionada con las ventas, de modo\nque pueda consultarse de forma rápida y eficiente.\nLa información a mantener debe incluir, para cada combinación de mes, año y producto:\n● Cantidad total vendida\n● Precio máximo de venta\n● Precio mínimo de venta\n● Cliente que más compró (por cantidad)\nSe deberán implementar los objetos necesarios en SQL (tablas, vistas, índices,\nprocedimientos, etc.) para garantizar que esta información:\n1. Esté siempre disponible y actualizada, reflejando los datos de ventas.\n2. Permita un acceso optimizado a las consultas filtradas por mes y año.",
        "solution": "alter procedure sp_act_estadistica (@mes int , @anio int, @prod char(8))\nas\nbegin\n    declare @max decimal(12,2)\n    declare @min decimal(12,2)\n    declare @cant decimal(12,2)\n    declare @clie char(6)\n\n     select\n      @max = max(item_precio),\n      @min = min (item_precio) ,\n      @cant = sum(item_cantidad)\n     from factura f join item_factura i\n       on f.fact_sucursal = i.item_sucursal and\n          f.fact_tipo = i.item_tipo and\n          f.fact_numero = i.item_numero\n     where\n      year(fact_fecha) = @anio and\n      month(fact_fecha) = @mes and\n      item_producto = @prod\n    select\n      TOP 1 @clie = fact_cliente\n     from factura f join item_factura i\n       on f.fact_sucursal = i.item_sucursal and\n          f.fact_tipo = i.item_tipo and\n          f.fact_numero = i.item_numero\n     where\n      year(fact_fecha) = @anio and\n      month(fact_fecha) = @mes and\n      item_producto = @prod\n     group by\n      fact_cliente\n     order by\n      sum(item_cantidad) desc\n\n    UPDATE Productos_Anio_Mes\n    SET Cantidad_total = @cant,\n        Precio_Max = @max,\n        Precio_Min = @min,\n        Cliente_Que_Mas_Compro = @clie\n    WHERE Producto = @prod\n      AND Mes = @mes\n      AND Anio = @anio\n     \n      if @@rowcount = 0\n          begin\n              INSERT INTO Productos_Anio_Mes\n              (\n                  Producto,\n                  Anio,\n                  Mes,\n                  Cantidad_total,\n                  Precio_Max,\n                  Precio_Min,\n                  Cliente_Que_Mas_Compro\n              )\n              VALUES\n              (\n                  @prod,\n                  @anio,\n                  @mes,\n                  @cant,\n                  @max,\n                  @min,\n                  @clie\n              )\n         end\nend",
        "entities": [
            "Factura",
            "Item_Factura",
            "Productos_Anio_Mes"
        ],
        "id": 12
    }
];
