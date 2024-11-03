% DATOS DE ENTRADA
int: n; % Número de personas
int: m; % Número de opiniones posibles que pueden tener las personas
array[1..m] of int: p; % Número de personas en cada opinión inicial
array[1..m] of float: v; % Valores de las opiniones
array[1..m] of float: ce; % Valores de los costos extras
array[1..m, 1..m] of float: c; % Costo del esfuerzo de mover una persona de opinión i a opinión j
float: ct; % Costo total máximo permitido
int: maxM; % Número máximo de movimientos permitidos

% VARIABLES DE DECISIÓN
array[1..m, 1..m] of var 0..n: x; % Número de personas que se moverán de opinión i a opinión j

% FUNCIONES AUXILIARES
function int: indicator(bool: condition) = if condition then 1 else 0 endif;

% Cálculo de la mediana ponderada (mediana_pv)
var float: mediana_pv = 
    if sum(p) mod 2 = 1 then
        v[arg_sort(p)[(sum(p) + 1) div 2]]
    else
        (v[arg_sort(p)[sum(p) div 2]] + v[arg_sort(p)[(sum(p) div 2) + 1]]) / 2
    endif;

% Cálculo de la polarización total
var float: polarizacion = sum(i in 1..m)(p[i] * abs(v[i] - mediana_pv));

% FUNCIÓN OBJETIVO: Minimizar la polarización
solve minimize polarizacion;

% RESTRICCIONES
constraint
 sum(i in 1..m)(
      sum(j in 1..m)(
          c[i, j] * (1 + p[i] / n) * x[i, j] + ce[j] * x[i, j] * indicator(p[j] == 0)
      )
    ) <= ct;

constraint
forall(i in 1..m) (
    sum(j in 1..m) (x[i, j]) <= p[i]
);

constraint 
    sum(i in 1..m)(
        sum(j in 1..m)(
            abs(j - i) * x[i,j]
        )
    ) <= maxM;

constraint 
    sum(i in 1..m)(
        sum(j in 1..m)(
            x[i,j]
        )
    ) <= n;

% INSTRUCCIÓN DE SALIDA
output [
    "Polarizacion minima = ", show(polarizacion), "\n",
    "Movimientos entre opiniones:\n"
] ++
[
    "De opinion ", show(i), " a opinion ", show(j), ": ", show(x[i, j]), "\n"
    | i in 1..m, j in 1..m
    where x[i,j] > 0 % Solo mostrar movimientos donde hay personas moviéndose
];

