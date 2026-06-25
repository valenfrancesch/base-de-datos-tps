const exercisesData = [
    {
        id: 1,
        category: "SQL",
        statement: "Mostrar el código, razón social de todos los clientes cuyo límite de crédito sea mayor o igual a $ 1000 ordenado por código de cliente.",
        solution: `select clie_codigo, clie_razon_social
from Cliente
where clie_limite_credito >= 1000;`
    },
    {
        id: 2,
        category: "SQL",
        statement: "Mostrar el código, detalle de todos los artículos vendidos en el año 2012 ordenados por cantidad vendida.",
        solution: `select item_producto as codigo, P.prod_detalle
from Item_Factura
JOIN Producto P on item_producto = prod_codigo
group by item_producto, P.prod_detalle
order by sum(item_cantidad);`
    },
    {
        id: 3,
        category: "SQL",
        statement: "Realizar una consulta que muestre código de producto, nombre de producto y el stock total, sin importar en que deposito se encuentre, los datos deben ser ordenados por nombre del artículo de menor a mayor.",
        solution: `select prod_codigo, prod_detalle, sum(S.stoc_cantidad) as stock_total
from Producto
join STOCK S on prod_codigo = stoc_producto
group by prod_codigo, prod_detalle
order by prod_detalle;`
    },
    {
        id: 4,
        category: "SQL",
        statement: "Realizar una consulta que muestre para todos los artículos código, detalle y cantidad de artículos que lo componen. Mostrar solo aquellos artículos para los cuales el stock promedio por depósito sea mayor a 100.",
        solution: `select prod_codigo, prod_detalle, count(C.comp_componente) as cant_componente
from Producto
join Composicion C on prod_codigo = comp_producto
join STOCK S on prod_codigo = stoc_producto
group by prod_codigo, prod_detalle
having avg(S.stoc_cantidad) > 100;`
    },
    {
        id: 5,
        category: "SQL",
        statement: "Realizar una consulta que muestre código de artículo, detalle y cantidad de egresos de stock que se realizaron para ese artículo en el año 2012 (egresan los productos que fueron vendidos). Mostrar solo aquellos que hayan tenido más egresos que en el 2011.",
        solution: `select prod_codigo, prod_detalle, sum(I.item_cantidad) as Cantidad
from Producto
join Item_Factura I on prod_codigo = item_producto
join Factura F on item_numero = fact_numero
group by prod_codigo, prod_detalle, year(F.fact_fecha)
having 
  sum(case when year(fact_fecha) = 2012 then I.item_cantidad else 0 end)
  > sum(case when year(fact_fecha) = 2011 then I.item_cantidad else 0 end)`
    },
    {
        id: 6,
        category: "SQL",
        statement: "Mostrar para todos los rubros de artículos código, detalle, cantidad de artículos de ese rubro y stock total de ese rubro de artículos. Solo tener en cuenta aquellos artículos que tengan un stock mayor al del artículo '00000000' en el depósito '00'.",
        solution: `select rubr_id, rubr_detalle , count(P.prod_codigo) as cant_prodcutos, sum(S.stoc_cantidad) as stock
from Rubro
join Producto P on rubr_id = prod_rubro
join STOCK S on S.stoc_producto = p.prod_codigo
where S.stoc_cantidad > 
(select stoc_cantidad from stock where stoc_producto = '00000000' and stoc_deposito = '00')
group by rubr_id, rubr_detalle`
    },
    {
        id: 7,
        category: "SQL",
        statement: "Generar una consulta que muestre para cada artículo código, detalle, mayor precio menor precio y % de la diferencia de precios (respecto del menor Ej.: menor precio = 10, mayor precio =12 => mostrar 20 %). Mostrar solo aquellos artículos que posean stock.",
        solution: `select prod_detalle, min(item_precio) as min_precio, max(item_precio) as max_precio, ((max(item_precio)-min(item_precio))/min(item_precio))*100 as diferencia
from Producto
join Item_Factura on prod_codigo = item_producto
WHERE EXISTS (
  SELECT 1 FROM STOCK s WHERE s.stoc_producto = prod_codigo GROUP BY s.stoc_producto HAVING SUM(s.stoc_cantidad) > 0
)
group by prod_codigo, prod_detalle`
    },
    {
        id: 8,
        category: "SQL",
        statement: "Mostrar para el o los artículos que tengan stock en todos los depósitos, nombre del artículo, stock del depósito que más stock tiene.",
        solution: `select prod_detalle, max(stoc_cantidad)
from Producto
join stock on stoc_producto = prod_codigo
group by prod_codigo, prod_detalle
having count(stoc_deposito) = (select count (*) from DEPOSITO);`
    },
    {
        id: 9,
        category: "SQL",
        statement: "Mostrar el código del jefe, código del empleado que lo tiene como jefe, nombre del mismo y la cantidad de depósitos que ambos tienen asignados.",
        solution: `Select E2.empl_nombre as jefe, E2.empl_codigo as jefe, E.empl_nombre, E.empl_codigo,
((select count(*) from DEPOSITO D where D.depo_encargado = E.empl_codigo) +
(select count(*) from DEPOSITO D1 where D1.depo_encargado = E2.empl_codigo))
from Empleado E
JOIN Empleado E2 on E.empl_jefe = E2.empl_codigo
group by E.empl_codigo, E2.empl_nombre, E2.empl_codigo, E.empl_nombre`
    },
    {
        id: 10,
        category: "SQL",
        statement: "Mostrar los 10 productos más vendidos en la historia y también los 10 productos menos vendidos en la historia. Además mostrar de esos productos, quien fue el cliente que mayor compra realizo.",
        solution: `WITH menos_vendidos as (SELECT TOP 10 prod_codigo, prod_detalle, sum(item_cantidad) as cantidad_comprada from Producto left join Item_Factura on prod_codigo = item_producto group by prod_codigo, prod_detalle order by sum(item_cantidad) asc),
mas_vendidos as (SELECT TOP 10 prod_codigo, prod_detalle, sum(item_cantidad)as cantidad_comprada from Producto join Item_Factura on prod_codigo = item_producto group by prod_codigo, prod_detalle order by sum(item_cantidad) desc ),
lista_unida as (Select prod_codigo, prod_detalle, cantidad_comprada from menos_vendidos union Select prod_codigo, prod_detalle, cantidad_comprada from mas_vendidos)
Select prod_codigo, prod_detalle, cantidad_comprada,
(select TOP 1 fact_cliente from Factura join Item_Factura on fact_numero = item_numero and fact_sucursal = item_sucursal where item_producto = prod_codigo group by fact_cliente order by sum(item_cantidad) desc)
from lista_unida`
    },
    {
        id: 11,
        category: "SQL",
        statement: "Realizar una consulta que retorne el detalle de la familia, la cantidad diferentes de productos vendidos y el monto de dichas ventas sin impuestos. Los datos se deberán ordenar de mayor a menor, por la familia que más productos diferentes vendidos tenga, solo se deberán mostrar las familias que tengan una venta superior a 20000 pesos para el año 2012.",
        solution: `SELECT f.fami_id AS cod_familia, f.fami_detalle AS detalle_familia, count (distinct p.prod_codigo) as cantidad_productos, sum(ifa.item_precio*item_cantidad) as facturado
from Familia f
join Producto p on p.prod_familia = f.fami_id
join Item_Factura ifa on p.prod_codigo = ifa.item_producto
join Factura fa on fa.fact_numero = ifa.item_numero and fa.fact_sucursal = ifa.item_sucursal and fa.fact_tipo = ifa.item_tipo
group by f.fami_detalle, f.fami_id
having sum(case when year(fa.fact_fecha) = 2012 then ifa.item_precio*item_cantidad else 0 end) > 20000
order by cantidad_productos;`
    },
    {
        id: 12,
        category: "SQL",
        statement: "Mostrar nombre de producto, cantidad de clientes distintos que lo compraron importe promedio pagado por el producto, cantidad de depósitos en los cuales hay stock del producto y stock actual del producto en todos los depósitos. Se deberán mostrar aquellos productos que hayan tenido operaciones en el año 2012 y los datos deberán ordenarse de mayor a menor por monto vendido del producto.",
        solution: `Select prod_detalle, count (distinct fact_cliente) as clientes_que_compraron, avg(item_precio) as precio_promedio,
(Select count (*) from STOCK s where s.stoc_producto = prod_codigo and s.stoc_cantidad > 0 ) as cantidad_depositos,
(select sum(s.stoc_cantidad) from STOCK s where s.stoc_producto = prod_codigo) as stock_actual_total
from Producto
join Item_Factura on prod_codigo = item_producto
join Factura on item_numero = fact_numero and item_tipo = fact_tipo and item_sucursal = fact_sucursal
where prod_codigo in (
  select p.item_producto from Item_Factura p
  join Factura fa on p.item_numero = fa.fact_numero and p.item_tipo = fa.fact_tipo and p.item_sucursal = fa.fact_sucursal
  where year(fa.fact_fecha)= 2012
)
group by prod_detalle, prod_codigo
order by sum(item_precio*item_cantidad) desc`
    },
    {
        id: 13,
        category: "SQL",
        statement: "Realizar una consulta que retorne para cada producto que posea composición nombre del producto, precio del producto, precio de la sumatoria de los precios por la cantidad de los productos que lo componen. Solo se deberán mostrar los productos que estén compuestos por más de 2 productos y deben ser ordenados de mayor a menor por cantidad de productos que lo componen.",
        solution: `Select P1.prod_detalle, P1.prod_precio, sum(P2.prod_precio*comp_cantidad) as precipo_componentes, sum(comp_cantidad) as cant_total_componentes
from Composicion
join Producto P1 on P1.prod_codigo = comp_producto
join Producto P2 on P2.prod_codigo = comp_componente
group by P1.prod_detalle, P1.prod_precio, P1.prod_codigo
having sum(comp_cantidad) > 2
order by sum(comp_cantidad) desc;`
    },
    {
        id: 14,
        category: "SQL",
        statement: "Escriba una consulta que retorne una estadística de ventas por cliente. Los campos que debe retornar son: Código del cliente, Cantidad de veces que compro en el último año, Promedio por compra en el último año, Cantidad de productos diferentes que compro en el último año, Monto de la mayor compra que realizo en el último año.",
        solution: `SELECT c.clie_codigo AS codigo_cliente,
ISNULL(COUNT(DISTINCT f.fact_numero + f.fact_tipo + f.fact_sucursal), 0) AS cant_veces,
ISNULL(AVG(f.fact_total), 0) AS promedio_importe,
ISNULL(( SELECT COUNT(DISTINCT sub_if.item_producto) FROM Item_Factura sub_if JOIN Factura sub_f ON sub_if.item_numero = sub_f.fact_numero AND sub_if.item_tipo = sub_f.fact_tipo AND sub_if.item_sucursal = sub_f.fact_sucursal WHERE sub_f.fact_cliente = c.clie_codigo AND YEAR(sub_f.fact_fecha) = (SELECT MAX(YEAR(fact_fecha)) FROM Factura) ), 0) AS productos_distintos,
ISNULL(MAX(f.fact_total), 0) AS max_compra
FROM Cliente c
LEFT JOIN Factura f ON c.clie_codigo = f.fact_cliente AND YEAR(f.fact_fecha) = (SELECT MAX(YEAR(fact_fecha)) FROM Factura)
GROUP BY c.clie_codigo
ORDER BY cant_veces DESC;`
    },
    {
        id: 15,
        category: "SQL",
        statement: "Escriba una consulta que retorne los pares de productos que hayan sido vendidos juntos (en la misma factura) más de 500 veces. El resultado debe mostrar el código y descripción de cada uno de los productos y la cantidad de veces que fueron vendidos juntos.",
        solution: `Select I1.item_producto, P1.prod_detalle, I2.item_producto, P2.prod_detalle, count (*) as total
from Item_Factura I1
join Item_Factura I2 on I1.item_numero = I2.item_numero and I1.item_sucursal = I2.item_sucursal and I1.item_tipo = I2.item_tipo
join Producto P1 on I1.item_producto = P1.prod_codigo
join Producto P2 on I2.item_producto = P2.prod_codigo
where I1.item_numero = I2.item_numero and I1.item_producto > I2.item_producto
group by I1.item_producto, I2.item_producto, P1.prod_detalle,P2.prod_detalle
having count (*) > 500
order by count (*) desc`
    },
    {
        id: 16,
        category: "SQL",
        statement: "Con el fin de lanzar una nueva campaña comercial para los clientes que menos compran en la empresa, se pide una consulta SQL que retorne aquellos clientes cuyas ventas son inferiores a 1/3 del promedio de ventas del producto que más se vendió en el 2012.",
        solution: `Select F1.fact_cliente, clie_razon_social, sum(I1.item_cantidad) as vendido_por_cliente,
(select top 1 item_producto from Item_Factura I2 join Factura f2 on f2.fact_numero = I2.item_numero and f2.fact_tipo = I2.item_tipo and f2.fact_sucursal = I2.item_sucursal where f2.fact_cliente = F1.fact_cliente and year(f2.fact_fecha) = 2012 group by I2.item_producto order by sum(I2.item_cantidad) desc, item_producto asc)
from Factura F1
join Item_Factura I1 on item_numero = fact_numero and item_sucursal = fact_sucursal and item_tipo = fact_tipo
join Cliente on fact_cliente = clie_codigo
where year(fact_fecha) = 2012
group by fact_cliente, clie_razon_social, clie_domicilio
having sum(I1.item_cantidad* I1.item_precio) < (
  select top 1 (avg(item_cantidad*item_precio)/3.0) as prom
  from Item_Factura join Factura on item_numero = fact_numero and item_sucursal = fact_sucursal and item_tipo = fact_tipo
  where year(fact_fecha) = 2012
  group by item_producto
  order by sum(item_cantidad) desc
)
order by clie_domicilio asc`
    },
    {
        id: 17,
        category: "SQL",
        statement: "Escriba una consulta que retorne una estadística de ventas por año y mes para cada producto. La consulta debe retornar: PERIODO, PROD, DETALLE, CANTIDAD_VENDIDA, VENTAS_AÑO_ANT, CANT_FACTURAS.",
        solution: `SELECT CONVERT(CHAR(6), F1.fact_fecha, 112) AS PERIODO, I1.item_producto AS PROD, P.prod_detalle AS DETALLE, ISNULL(SUM(I1.item_cantidad), 0) AS CANTIDAD_VENDIDA,
ISNULL(( SELECT SUM(I_Ant.item_cantidad) FROM Item_Factura I_Ant JOIN Factura F_Ant ON I_Ant.item_tipo = F_Ant.fact_tipo AND I_Ant.item_sucursal = F_Ant.fact_sucursal AND I_Ant.item_numero = F_Ant.fact_numero WHERE I_Ant.item_producto = I1.item_producto AND MONTH(F_Ant.fact_fecha) = MONTH(F1.fact_fecha) AND YEAR(F_Ant.fact_fecha) = YEAR(F1.fact_fecha) - 1 ), 0) AS VENTAS_AÑO_ANT,
ISNULL(COUNT(DISTINCT F1.fact_tipo + F1.fact_sucursal + F1.fact_numero), 0) AS CANT_FACTURAS
FROM Item_Factura I1
JOIN Producto P ON P.prod_codigo = I1.item_producto
JOIN Factura F1 ON F1.fact_tipo = I1.item_tipo AND F1.fact_sucursal = I1.item_sucursal AND F1.fact_numero = I1.item_numero
GROUP BY CONVERT(CHAR(6), F1.fact_fecha, 112), MONTH(F1.fact_fecha), YEAR(F1.fact_fecha), I1.item_producto, P.prod_detalle
ORDER BY PERIODO ASC, PROD ASC;`
    },
    {
        id: 18,
        category: "SQL",
        statement: "Escriba una consulta que retorne una estadística de ventas para todos los rubros. DETALLE_RUBRO, VENTAS, PROD1, PROD2, CLIENTE.",
        solution: `Select rubr_detalle, isnull(sum(item_precio*item_cantidad), 0) as ventas,
isnull((select top 1 item_producto from Item_Factura f1 join Producto p1 on f1.item_producto = p1.prod_codigo and p1.prod_rubro = rubr_id group by f1.item_producto order by sum(f1.item_cantidad) desc), '') as prod1,
isnull((select top 1 item_producto from Item_Factura f1 join Producto p1 on f1.item_producto = p1.prod_codigo and p1.prod_rubro = rubr_id where item_producto != (select top 1 item_producto from Item_Factura f1 join Producto p1 on f1.item_producto = p1.prod_codigo and p1.prod_rubro = rubr_id group by f1.item_producto order by sum(f1.item_cantidad) desc) group by f1.item_producto order by sum(f1.item_cantidad) desc), '') as prod2,
isnull((select top 1 fact_cliente from Factura join Item_Factura f3 on f3.item_numero = fact_numero and f3.item_tipo = fact_tipo and f3.item_sucursal = fact_sucursal join Producto p1 on f3.item_producto = p1.prod_codigo where rubr_id = p1.prod_rubro group by fact_cliente order by sum(f3.item_cantidad) desc ), '') as cliente
from Rubro
left join Producto p on prod_rubro = rubr_id
left join Item_Factura on item_producto = prod_codigo
group by rubr_detalle, rubr_id
order by count(distinct item_producto) desc`
    },
    {
        id: 19,
        category: "SQL",
        statement: "En virtud de una recategorizacion de productos referida a la familia de los mismos se solicita que desarrolle una consulta sql que retorne para todos los productos: Codigo, Detalle, Familia, Familia sugerida...",
        solution: `select prod_codigo, prod_detalle, prod_familia, fami_detalle,
(select top 1 f2.fami_id from Familia f2 join Producto p2 on p2.prod_familia = f2.fami_id where substring(p2.prod_detalle, 1, 5) = substring(p.prod_detalle, 0, 5) group by f2.fami_id, f2.fami_detalle order by count(*) desc, f2.fami_id asc ) as fami_2,
(select top 1 f2.fami_detalle from Familia f2 join Producto p2 on p2.prod_familia = f2.fami_id where substring(p2.prod_detalle, 1, 5) = substring(p.prod_detalle, 0, 5) group by f2.fami_id, f2.fami_detalle order by count(*) desc, f2.fami_id asc )
from Producto p
join Familia f on prod_familia = fami_id
where (select top 1 f2.fami_id from Familia f2 join Producto p2 on p2.prod_familia = f2.fami_id where substring(p2.prod_detalle, 1, 5) = substring(p.prod_detalle, 0, 5) group by f2.fami_id, f2.fami_detalle order by count(*) desc, f2.fami_id asc ) != f.fami_id
order by prod_detalle asc`
    },
    {
        id: 20,
        category: "SQL",
        statement: "Escriba una consulta sql que retorne un ranking de los mejores 3 empleados del 2012. Se debera retornar legajo, nombre y apellido, anio de ingreso, puntaje 2011, puntaje 2012.",
        solution: `select empl_codigo, empl_nombre, empl_apellido, empl_ingreso,
case when (select count(*) from Factura f1 where f1.fact_vendedor = empl_codigo and year(f1.fact_fecha)=2011) >= 50 then (select count(*) from Factura f2 where f2.fact_vendedor = empl_codigo and year(f2.fact_fecha)=2011 and f2.fact_total > 100) else 0.5 * isnull((select count(*) from Factura f3 join Empleado e2 on f3.fact_vendedor = e2.empl_codigo where e2.empl_jefe = e.empl_codigo and year(f3.fact_fecha) = 2011 ), 0) end as puntaje_2011,
case when (select count(*) from Factura f1 where f1.fact_vendedor = empl_codigo and year(f1.fact_fecha)=2012) >= 50 then (select count(*) from Factura f2 where f2.fact_vendedor = empl_codigo and year(f2.fact_fecha)=2012 and f2.fact_total > 100) else 0.5 * isnull((select count(*) from Factura f3 join Empleado e2 on f3.fact_vendedor = e2.empl_codigo where e2.empl_jefe = e.empl_codigo and year(f3.fact_fecha) = 2012 ), 0) end as puntaje_2012
from Empleado e
group by empl_codigo, empl_nombre, empl_apellido, empl_ingreso`
    },
    {
        id: 21,
        category: "SQL",
        statement: "Escriba una consulta sql que retorne para todos los años, en los cuales se haya hecho al menos una factura, la cantidad de clientes a los que se les facturó de manera incorrecta...",
        solution: `SELECT YEAR(F_Out.fact_fecha) AS [Año],
ISNULL(( SELECT COUNT(DISTINCT F_Clie.fact_cliente) FROM Factura F_Clie WHERE YEAR(F_Clie.fact_fecha) = YEAR(F_Out.fact_fecha) AND EXISTS ( SELECT 1 FROM Item_Factura I WHERE I.item_tipo = F_Clie.fact_tipo AND I.item_sucursal = F_Clie.fact_sucursal AND I.item_numero = F_Clie.fact_numero HAVING ABS(F_Clie.fact_total - F_Clie.fact_total_impuestos - SUM(I.item_cantidad * I.item_precio)) > 1 ) ), 0) AS [Clientes Mal Facturados],
ISNULL(( SELECT COUNT(*) FROM Factura F_Mal WHERE YEAR(F_Mal.fact_fecha) = YEAR(F_Out.fact_fecha) AND EXISTS ( SELECT 1 FROM Item_Factura I WHERE I.item_tipo = F_Mal.fact_tipo AND I.item_sucursal = F_Mal.fact_sucursal AND I.item_numero = F_Mal.fact_numero HAVING ABS(F_Mal.fact_total - F_Mal.fact_total_impuestos - SUM(I.item_cantidad * I.item_precio)) > 1 ) ), 0) AS [Facturas Incorrectas]
FROM Factura F_Out
GROUP BY YEAR(F_Out.fact_fecha)
ORDER BY [Año] ASC;`
    },
    {
        id: 22,
        category: "SQL",
        statement: "Escriba una consulta sql que retorne una estadistica de venta para todos los rubros por trimestre contabilizando todos los años. Se mostraran como maximo 4 filas por rubro (1 por cada trimestre).",
        solution: `SELECT R.rubr_detalle AS DETALLE_RUBRO, DATEPART(quarter, F.fact_fecha) AS NUMERO_TRIMESTRE, ISNULL(COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero), 0) AS CANT_FACTURAS, ISNULL(COUNT(DISTINCT I.item_producto), 0) AS CANT_PRODUCTOS_DIFERENTES
FROM Rubro R
JOIN Producto P ON P.prod_rubro = R.rubr_id
JOIN Item_Factura I ON I.item_producto = P.prod_codigo
JOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero
WHERE P.prod_codigo NOT IN (SELECT DISTINCT comp_producto FROM Composicion)
GROUP BY R.rubr_id, R.rubr_detalle, DATEPART(quarter, F.fact_fecha)
HAVING COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) > 100
ORDER BY R.rubr_detalle ASC, CANT_FACTURAS DESC;`
    },
    {
        id: 23,
        category: "SQL",
        statement: "Realizar una consulta SQL que para cada año muestre : Año, El producto con composición más vendido para ese año, Cantidad de productos que componen directamente al producto más vendido, La cantidad de facturas en las cuales aparece ese producto, El código de cliente que más compro ese producto, El porcentaje que representa la venta de ese producto respecto al total de venta del año.",
        solution: `SELECT YEAR(F_Out.fact_fecha) AS AÑO,
(SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC) AS PROD_COMP_ESTRELLA,
ISNULL(( SELECT COUNT(*) FROM Composicion WHERE comp_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) ), 0) AS CANT_COMPONENTES,
ISNULL(( SELECT COUNT(DISTINCT F_Cont.fact_tipo + F_Cont.fact_sucursal + F_Cont.fact_numero) FROM Item_Factura I_Cont JOIN Factura F_Cont ON I_Cont.item_tipo = F_Cont.fact_tipo AND I_Cont.item_sucursal = F_Cont.fact_sucursal AND I_Cont.item_numero = F_Cont.fact_numero WHERE YEAR(F_Cont.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Cont.item_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) ), 0) AS CANT_FACTURAS,
ISNULL(( SELECT TOP 1 F_Clie.fact_cliente FROM Item_Factura I_Clie JOIN Factura F_Clie ON I_Clie.item_tipo = F_Clie.fact_tipo AND I_Clie.item_sucursal = F_Clie.fact_sucursal AND I_Clie.item_numero = F_Clie.fact_numero WHERE YEAR(F_Clie.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Clie.item_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) GROUP BY F_Clie.fact_cliente ORDER BY SUM(I_Clie.item_cantidad) DESC, F_Clie.fact_cliente ASC ), '-') AS CLIENTE_MAYOR_COMPRA,
(ISNULL(( SELECT SUM(I_P.item_cantidad * I_P.item_precio) FROM Item_Factura I_P JOIN Factura F_P ON I_P.item_tipo = F_P.fact_tipo AND I_P.item_sucursal = F_P.fact_sucursal AND I_P.item_numero = F_P.fact_numero WHERE YEAR(F_P.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_P.item_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F_Out.fact_fecha) AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) ), 0) / (SELECT SUM(F_Tot.fact_total) FROM Factura F_Tot WHERE YEAR(F_Tot.fact_fecha) = YEAR(F_Out.fact_fecha))) * 100 AS PORCENTAJE_ANUAL
FROM Factura F_Out
GROUP BY YEAR(F_Out.fact_fecha)
ORDER BY (SELECT SUM(F_Sub.fact_total) FROM Factura F_Sub WHERE YEAR(F_Sub.fact_fecha) = YEAR(F_Out.fact_fecha)) DESC;`
    },
    {
        id: 24,
        category: "SQL",
        statement: "Escriba una consulta que considerando solamente las facturas correspondientes a los dos vendedores con mayores comisiones, retorne los productos con composición facturados al menos en cinco facturas...",
        solution: `SELECT P.prod_codigo AS CODIGO_PRODUCTO, P.prod_detalle AS NOMBRE_PRODUCTO, ISNULL(SUM(I.item_cantidad), 0) AS UNIDADES_FACTURADAS
FROM Producto P
JOIN Item_Factura I ON I.item_producto = P.prod_codigo
JOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero
WHERE F.fact_vendedor IN (SELECT TOP 2 empl_codigo FROM Empleado ORDER BY empl_comision DESC) AND P.prod_codigo IN (SELECT comp_producto FROM Composicion)
GROUP BY P.prod_codigo, P.prod_detalle
HAVING COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) >= 5
ORDER BY UNIDADES_FACTURADAS DESC;`
    },
    {
        id: 25,
        category: "SQL",
        statement: "Realizar una consulta SQL que para cada año y familia muestre : a. Año b. El código de la familia más vendida en ese año...",
        solution: `SELECT YEAR(F.fact_fecha) AS AÑO, Fa.fami_id AS COD_FAMILIA,
ISNULL((SELECT COUNT(*) FROM Rubro WHERE rubr_id IN (SELECT prod_rubro FROM Producto WHERE prod_familia = Fa.fami_id)), 0) AS CANT_RUBROS,
ISNULL(( SELECT COUNT(*) FROM Composicion WHERE comp_producto = ( SELECT TOP 1 I_Max.item_producto FROM Item_Factura I_Max JOIN Producto P_Max ON I_Max.item_producto = P_Max.prod_codigo JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero WHERE YEAR(F_Max.fact_fecha) = YEAR(F.fact_fecha) AND P_Max.prod_familia = Fa.fami_id AND I_Max.item_producto IN (SELECT comp_producto FROM Composicion) GROUP BY I_Max.item_producto ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC ) ), 0) AS COMPONENTES_PRODUCTO_ESTRELLA,
COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) AS CANT_FACTURAS,
ISNULL(( SELECT TOP 1 F_C.fact_cliente FROM Item_Factura I_C JOIN Producto P_C ON I_C.item_producto = P_C.prod_codigo JOIN Factura F_C ON I_C.item_tipo = F_C.fact_tipo AND I_C.item_sucursal = F_C.fact_sucursal AND I_C.item_numero = F_C.fact_numero WHERE YEAR(F_C.fact_fecha) = YEAR(F.fact_fecha) AND P_C.prod_familia = Fa.fami_id GROUP BY F_C.fact_cliente ORDER BY SUM(I_C.item_cantidad) DESC, F_C.fact_cliente ASC ), '-') AS CLIENTE_LIDER,
STR((SUM(I.item_cantidad * I.item_precio) / (SELECT SUM(F_T.fact_total) FROM Factura F_T WHERE YEAR(F_T.fact_fecha) = YEAR(F.fact_fecha))) * 100, 5, 2) AS PORCENTAJE_VENTA
FROM Familia Fa
JOIN Producto P ON P.prod_familia = Fa.fami_id
JOIN Item_Factura I ON I.item_producto = P.prod_codigo
JOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero
GROUP BY YEAR(F.fact_fecha), Fa.fami_id
ORDER BY AÑO DESC, SUM(I.item_cantidad * I.item_precio) DESC;`
    },
    {
        id: 26,
        category: "SQL",
        statement: "Escriba una consulta sql que retorne un ranking de empleados devolviendo las siguientes columnas: Empleado, Depósitos que tiene a cargo, Monto total facturado en el año corriente, Codigo de Cliente al que mas le vendió, Producto más vendido, Porcentaje de la venta de ese empleado sobre el total vendido ese año. Los datos deberan ser ordenados por venta del empleado de mayor a menor.",
        solution: `SELECT 
    E.empl_nombre AS Empleado,
    
    -- 1. Depósitos a cargo
    ISNULL((SELECT COUNT(*) FROM Deposito D WHERE D.depo_encargado = E.empl_codigo), 0) AS depositos_a_cargo,
    
    -- 2. Monto total facturado en el año corriente (Asumimos año actual o un año específico como 2012)
    ISNULL(SUM(F.fact_total), 0) AS monto_total_facturado,
    
    -- 3. Código de Cliente al que más le vendió
    ISNULL((
        SELECT TOP 1 F2.fact_cliente
        FROM Factura F2
        WHERE F2.fact_vendedor = E.empl_codigo AND YEAR(F2.fact_fecha) = 2012
        GROUP BY F2.fact_cliente
        ORDER BY SUM(F2.fact_total) DESC
    ), '-') AS cliente_estrella,
    
    -- 4. Producto más vendido por este empleado
    ISNULL((
        SELECT TOP 1 I.item_producto
        FROM Item_Factura I
        JOIN Factura F3 ON I.item_numero = F3.fact_numero 
                       AND I.item_sucursal = F3.fact_sucursal 
                       AND I.item_tipo = F3.fact_tipo
        WHERE F3.fact_vendedor = E.empl_codigo AND YEAR(F3.fact_fecha) = 2012
        GROUP BY I.item_producto
        ORDER BY SUM(I.item_cantidad) DESC
    ), '-') AS producto_mas_vendido,
    
    -- 5. Porcentaje de venta sobre el total
    (ISNULL(SUM(F.fact_total), 0) / 
        (SELECT SUM(fact_total) FROM Factura WHERE YEAR(fact_fecha) = 2012)) * 100 AS porcentaje_venta

FROM Empleado E
LEFT JOIN Factura F ON E.empl_codigo = F.fact_vendedor AND YEAR(F.fact_fecha) = 2012
GROUP BY E.empl_codigo, E.empl_nombre
ORDER BY monto_total_facturado DESC;`
    },
    {
        id: 27,
        category: "SQL",
        statement: "Escriba una consulta sql que retorne una estadística basada en la facturacion por año y envase devolviendo las siguientes columnas:\n- Año\n- Codigo de envase\n- Detalle del envase\n- Cantidad de productos que tienen ese envase\n- Cantidad de productos facturados de ese envase\n- Producto mas vendido de ese envase\n- Monto total de venta de ese envase en ese año\n- Porcentaje de la venta de ese envase respecto al total vendido de ese año\nLos datos deberan ser ordenados por año y dentro del año por el envase con más facturación de mayor a menor.",
        solution: `SELECT 
    YEAR(F.fact_fecha) AS AÑO,
    P.prod_envase AS COD_ENVASE, 
    enva_detalle,
    COUNT(DISTINCT P.prod_codigo) AS CANT_PRODUCTOS_CON_ENVASE,
    ISNULL(SUM(I.item_cantidad), 0) AS PRODUCTOS_FACTURADOS,

    -- Producto más vendido de ese envase en el año
    ISNULL((
        SELECT TOP 1 I_Max.item_producto
        FROM Item_Factura I_Max JOIN Producto P_Max ON I_Max.item_producto = P_Max.prod_codigo
        JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero
        WHERE YEAR(F_Max.fact_fecha) = YEAR(F.fact_fecha) AND P_Max.prod_envase = P.prod_envase
        GROUP BY I_Max.item_producto
        ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC
    ), '-') AS PROD_MAS_VENDIDO,

    SUM(I.item_cantidad * I.item_precio) AS MONTO_TOTAL_VENTA,
    (SUM(I.item_cantidad * I.item_precio) / (SELECT SUM(F_T.fact_total) FROM Factura F_T WHERE YEAR(F_T.fact_fecha) = YEAR(F.fact_fecha))) * 100 AS PORCENTAJE_VENTA

FROM Producto P
JOIN Item_Factura I ON I.item_producto = P.prod_codigo
JOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero
JOIN Envases on P.prod_envase = enva_codigo
GROUP BY YEAR(F.fact_fecha), P.prod_envase, enva_detalle
ORDER BY AÑO DESC, MONTO_TOTAL_VENTA DESC;`
    },
    {
        id: 28,
        category: "SQL",
        statement: "Escriba una consulta sql que retorne una estadística por Año y Vendedor que retorne las siguientes columnas:\n- Año\n- Codigo de Vendedor\n- Detalle del Vendedor\n- Cantidad de facturas que realizó en ese año\n- Cantidad de clientes a los cuales les vendió en ese año\n- Cantidad de productos facturados con composición en ese año\n- Cantidad de productos facturados sin composicion en ese año\n- Monto total vendido por ese vendedor en ese año\nLos datos deberan ser ordenados por año y dentro del año por el vendedor que haya vendido mas productos diferentes de mayor a menor.",
        solution: `SELECT
    YEAR(F.fact_fecha) AS ANIO,
    E.empl_codigo,
    CONCAT(E.empl_nombre, ' ', E.empl_apellido) AS DETALLE_VENDEDOR,

    COUNT(
        DISTINCT CONCAT(
            F.fact_tipo,'-',
            F.fact_sucursal,'-',
            F.fact_numero
        )
    ) AS CANT_FACTURAS,

    COUNT(DISTINCT F.fact_cliente) AS CANT_CLIENTES,

COUNT(DISTINCT CASE
    WHEN C.comp_producto IS NOT NULL
    THEN I.item_producto
END) AS PROD_CON_COMPOSICION,

COUNT(DISTINCT CASE
    WHEN C.comp_producto IS NULL
    THEN I.item_producto
END) AS PROD_SIN_COMPOSICION

   , SUM(I.item_cantidad * I.item_precio) AS MONTO_TOTAL_VENDIDO

FROM Empleado E
JOIN Factura F
    ON F.fact_vendedor = E.empl_codigo
JOIN Item_Factura I
    ON I.item_tipo = F.fact_tipo
    AND I.item_sucursal = F.fact_sucursal
    AND I.item_numero = F.fact_numero
LEFT JOIN Composicion C
    ON C.comp_producto = I.item_producto

GROUP BY
    YEAR(F.fact_fecha),
    E.empl_codigo,
    E.empl_nombre,
    E.empl_apellido

ORDER BY YEAR(F.fact_fecha), COUNT(DISTINCT I.item_producto) DESC;`
    },
    {
        id: 29,
        category: "SQL",
        statement: "Se solicita que realice una estadística de venta por producto para el año 2011, solo para los productos que pertenezcan a las familias que tengan más de 20 productos asignados a ellas, la cual deberá devolver las siguientes columnas:\n- Código de producto\n- Descripción del producto\n- Cantidad vendida\n- Cantidad de facturas en la que esta ese producto\n- Monto total facturado de ese producto\nSolo se deberá mostrar un producto por fila en función a los considerandos establecidos antes. El resultado deberá ser ordenado por el la cantidad vendida de mayor a menor.",
        solution: `Select prod_codigo, prod_detalle,
sum(item_cantidad) as cantidad_vendida,
count(fact_tipo+fact_numero+fact_sucursal) as cantidad_facturas,
sum(item_cantidad*item_precio) as total_facturado
from Producto
join Item_Factura on prod_codigo = item_producto
join Factura on item_numero = fact_numero
and item_sucursal = fact_sucursal
and item_tipo = fact_tipo
where year(fact_fecha) = 2011
and prod_familia in 
	(select prod_familia
	from Producto 
	group by prod_familia
	having count(*) > 20)
group by prod_codigo, prod_detalle
order by sum(item_cantidad) desc;`
    },
    {
        id: 30,
        category: "SQL",
        statement: "Se desea obtener una estadistica de ventas del año 2012, para los empleados que sean jefes, o sea, que tengan empleados a su cargo, para ello se requiere que realice la consulta que retorne las siguientes columnas: Nombre del Jefe, Cantidad de empleados a cargo, Monto total vendido de los empleados a cargo, Cantidad de facturas realizadas por los empleados a cargo, Nombre del empleado con mejor ventas de ese jefe.",
        solution: `select e1.empl_jefe, e2.empl_nombre,
count(distinct e1.empl_codigo) as empleados_a_cargo,
sum(fact_total) as total_facturado,
count(DISTINCT fact_tipo + fact_sucursal + fact_numero) as total_facturas,
isnull((select top 1 e3.empl_nombre from Empleado e3 join Factura f on f.fact_vendedor = e3.empl_codigo where e3.empl_jefe = e1.empl_jefe and year(f.fact_fecha) = 2012 group by e3.empl_codigo, e3.empl_nombre order by sum(f.fact_total) desc ), '-') as mayor_empleado
from Empleado e1
join Empleado e2 on e1.empl_jefe = e2.empl_codigo
left join Factura on e1.empl_codigo = fact_vendedor and year(fact_fecha) = 2012
group by e1.empl_jefe, e2.empl_nombre
having count(DISTINCT fact_tipo + fact_sucursal + fact_numero) > 10
order by sum(fact_total) desc`
    },
    {
        id: 31,
        category: "SQL",
        statement: "Escriba una consulta sql que retorne una estadística por Año y Vendedor que retorne las siguientes columnas: Año, Codigo de Vendedor, Detalle del Vendedor, Cantidad de facturas que realizó en ese año, Cantidad de clientes a los cuales les vendió en ese año, Cantidad de productos facturados con composición en ese año, Cantidad de productos facturados sin composicion en ese año, Monto total vendido por ese vendedor en ese año.",
        solution: `-- Solución no provista en el PDF.`
    },
    {
        id: 32,
        category: "SQL",
        statement: "Se desea conocer las familias que sus productos se facturaron juntos en las mismas facturas para ello se solicita que escriba una consulta sql que retorne los pares de familias que tienen productos que se facturaron juntos. Para ellos deberá devolver las siguientes columnas:\n- Código de familia\n- Detalle de familia\n- Código de familia\n- Detalle de familia\n- Cantidad de facturas\n- Total vendido\nLos datos deberan ser ordenados por Total vendido y solo se deben mostrar las familias que se vendieron juntas más de 10 veces.",
        solution: `SELECT 
    P1.prod_familia AS COD_FAMILIA_1,
    F1.fami_detalle AS DETALLE_FAMILIA_1,
    P2.prod_familia AS COD_FAMILIA_2,
    F2.fami_detalle AS DETALLE_FAMILIA_2,
    COUNT(DISTINCT I1.item_tipo + I1.item_sucursal + I1.item_numero) AS CANT_FACTURAS,
    ISNULL(SUM(I1.item_cantidad * I1.item_precio + I2.item_cantidad * I2.item_precio), 0) AS TOTAL_VENDIDO
FROM Item_Factura I1
JOIN Item_Factura I2 ON I1.item_tipo = I2.item_tipo 
                    AND I1.item_sucursal = I2.item_sucursal 
                    AND I1.item_numero = I2.item_numero
JOIN Producto P1 ON I1.item_producto = P1.prod_codigo
JOIN Producto P2 ON I2.item_producto = P2.prod_codigo
JOIN Familia F1 ON P1.prod_familia = F1.fami_id
JOIN Familia F2 ON P2.prod_familia = F2.fami_id
WHERE P1.prod_familia < P2.prod_familia -- Elimina simetrías (A-B y B-A) y reflexividad
GROUP BY P1.prod_familia, F1.fami_detalle, P2.prod_familia, F2.fami_detalle
HAVING COUNT(DISTINCT I1.item_tipo + I1.item_sucursal + I1.item_numero) > 10
ORDER BY TOTAL_VENDIDO DESC;`
    },
    {
        id: 33,
        category: "SQL",
        statement: "Se requiere obtener una estadística de venta de productos que sean componentes. Para ello se solicita que realiza la siguiente consulta que retorne la venta de los componentes del producto más vendido del año 2012. Se deberá mostrar:\na. Código de producto\nb. Nombre del producto\nc. Cantidad de unidades vendidas\nd. Cantidad de facturas en la cual se facturo\ne. Precio promedio facturado de ese producto.\nf. Total facturado para ese producto\nEl resultado deberá ser ordenado por el total vendido por producto para el año 2012.",
        solution: `SELECT 
    P.prod_codigo AS COD_PRODUCTO,
    P.prod_detalle AS NOMBRE_PRODUCTO,
    ISNULL(SUM(I.item_cantidad), 0) AS UNIDADES_VENDIDAS,
    COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) AS CANT_FACTURAS,
    ISNULL(AVG(I.item_precio), 0) AS PRECIO_PROMEDIO,
    ISNULL(SUM(I.item_cantidad * I.item_precio), 0) AS TOTAL_FACTURADO
FROM Producto P
JOIN Composicion C ON P.prod_codigo = C.comp_componente
JOIN Item_Factura I ON I.item_producto = P.prod_codigo
JOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero
WHERE YEAR(F.fact_fecha) = 2012
  AND C.comp_producto = ( -- Vinculado al combo estrella global de 2012
      SELECT TOP 1 I_Max.item_producto
      FROM Item_Factura I_Max JOIN Factura F_Max ON I_Max.item_tipo = F_Max.fact_tipo AND I_Max.item_sucursal = F_Max.fact_sucursal AND I_Max.item_numero = F_Max.fact_numero
      WHERE YEAR(F_Max.fact_fecha) = 2012
      GROUP BY I_Max.item_producto
      ORDER BY SUM(I_Max.item_cantidad) DESC, I_Max.item_producto ASC
  )
GROUP BY P.prod_codigo, P.prod_detalle
ORDER BY TOTAL_FACTURADO DESC;`
    },
    {
        id: 34,
        category: "SQL",
        statement: "Escriba una consulta sql que retorne para todos los rubros la cantidad de facturas mal facturadas por cada mes del año 2011 Se considera que una factura es incorrecta cuando en la misma factura se factutan productos de dos rubros diferentes. Si no hay facturas mal hechas se debe retornar 0. Las columnas que se deben mostrar son:\n1- Codigo de Rubro\n2- Mes\n3- Cantidad de facturas mal realizadas.",
        solution: `SELECT 
    R.rubr_id AS COD_RUBRO,
    M.mes_num AS MES,
    ISNULL(COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero), 0) AS CANT_FACTURAS_MAL_HECHAS
FROM Rubro R
-- Tabla de control escalar para forzar la salida de los 12 meses de forma obligatoria
CROSS JOIN (SELECT 1 AS mes_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) M
LEFT JOIN Producto P ON P.prod_rubro = R.rubr_id
LEFT JOIN Item_Factura I ON I.item_producto = P.prod_codigo
LEFT JOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero
                   AND YEAR(F.fact_fecha) = 2011 AND MONTH(F.fact_fecha) = M.mes_num
                   -- La condición de error: que en la misma factura exista otra línea de otro rubro diferente
                   AND EXISTS (
                       SELECT 1 FROM Item_Factura I_Check JOIN Producto P_Check ON I_Check.item_producto = P_Check.prod_codigo
                       WHERE I_Check.item_tipo = F.fact_tipo AND I_Check.item_sucursal = F.fact_sucursal AND I_Check.item_numero = F.fact_numero
                         AND P_Check.prod_rubro != R.rubr_id
                   )
GROUP BY R.rubr_id, M.mes_num
ORDER BY COD_RUBRO ASC, MES ASC;`
    },
    {
        id: 35,
        category: "SQL",
        statement: "Se requiere realizar una estadística de ventas por año y producto, para ello se solicita que escriba una consulta sql que retorne las siguientes columnas:\n- Año\n- Codigo de producto\n- Detalle del producto\n- Cantidad de facturas emitidas a ese producto ese año\n- Cantidad de vendedores diferentes que compraron ese producto ese año\n- Cantidad de productos a los cuales compone ese producto, si no compone a ninguno se debera retornar 0\n- Porcentaje de la venta de ese producto respecto a la venta total de ese año\nLos datos deberan ser ordenados por año y por producto con mayor cantidad vendida.",
        solution: `SELECT 
    YEAR(F.fact_fecha) AS AÑO,
    P.prod_codigo AS COD_PRODUCTO,
    P.prod_detalle AS DETALLE_PRODUCTO,
    COUNT(DISTINCT F.fact_tipo + F.fact_sucursal + F.fact_numero) AS CANT_FACTURAS,
    COUNT(DISTINCT F.fact_vendedor) AS VENDEDORES_DIFERENTES,
    
    -- Cantidad de combos en los que este artículo es componente (Hijo)
    ISNULL((SELECT COUNT(*) FROM Composicion WHERE comp_componente = P.prod_codigo), 0) AS PRODUCTOS_A_LOS_CUALES_COMPONE,
    
    -- Impacto porcentual de la línea sobre la facturación global de ese año exacto
    STR((SUM(I.item_cantidad * I.item_precio) / (SELECT SUM(F_T.fact_total) FROM Factura F_T WHERE YEAR(F_T.fact_fecha) = YEAR(F.fact_fecha))) * 100, 5, 2) AS PORCENTAJE_VENTA_ANUAL

FROM Producto P
JOIN Item_Factura I ON I.item_producto = P.prod_codigo
JOIN Factura F ON I.item_tipo = F.fact_tipo AND I.item_sucursal = F.fact_sucursal AND I.item_numero = F.fact_numero
GROUP BY YEAR(F.fact_fecha), P.prod_codigo, P.prod_detalle
ORDER BY AÑO DESC, SUM(I.item_cantidad) DESC; -- Ordenado por producto con mayor cantidad vendida`
    },
    {
        id: 36,
        category: "SQL",
        statement: "Hecho en clase: Mostrar los 10 productos más vendidos en la historia también los 10 productos menos vendidos en la historia. Además mostrar de esos productos, quien fue el cliente que mayor compra realizo",
        solution: `SELECT p.prod_detalle AS Nombre,
( SELECT TOP 1 fact_cliente FROM Factura JOIN Item_Factura ON item_sucursal = fact_sucursal AND item_numero = fact_numero AND item_tipo = fact_tipo WHERE item_producto = p.prod_codigo GROUP BY fact_cliente ORDER BY SUM(item_cantidad) DESC ) AS clie_que_mas_compro
FROM Producto p
WHERE p.prod_codigo IN ( SELECT TOP 10 p1.prod_codigo AS Producto_Mas_Vendido FROM Producto p1 JOIN Item_Factura i ON p1.prod_codigo = i.item_producto GROUP BY p1.prod_codigo, p1.prod_detalle ORDER BY ISNULL(SUM(item_cantidad), 0) DESC )
OR p.prod_codigo IN ( SELECT TOP 10 p1.prod_codigo AS Producto_Menos_Vendido FROM Producto p1 JOIN Item_Factura i ON p1.prod_codigo = i.item_producto GROUP BY p1.prod_codigo, p1.prod_detalle ORDER BY ISNULL(SUM(item_cantidad), 0) ASC );`
    }
];
