% Definición de parámetros (valores que se leerán desde el archivo data.dzn)
int: numPersonas;                          % Número de personas en la red social
int: numOpiniones;                          % Número de opiniones posibles
array[1..numOpiniones] of int: distribucionOpiniones; % Distribución de personas por opinión inicial
array[1..numOpiniones] of float: valoresOpiniones;    % Valores de las opiniones
array[1..numOpiniones] of float: costosExtras;        % Costos extra de moderación para cada opinión
array[1..numOpiniones, 1..numOpiniones] of float: costosDesplazamiento; % Matriz de costos de desplazamiento
float: costoTotalMax;                       % Costo total máximo permitido
int: maxMovimientos;                        % Número máximo de movimientos permitidos

% Variables de decisión
array[1..numOpiniones] of var 0..1: estrategiaModeracion; % Estrategia de moderación (0 = no modera, 1 = modera)
var float: esfuerzoTotal;                    % Esfuerzo total requerido para aplicar la estrategia
var float: extremismoFinal;                  % Nivel de extremismo final después de la moderación

% Restricciones
constraint
    % Restricción del costo total permitido para moderación
    sum(i in 1..numOpiniones)(
        distribucionOpiniones[i] * (estrategiaModeracion[i] * (1 - costosExtras[i]) * abs(valoresOpiniones[i]))
    ) <= costoTotalMax;

constraint
    % Restricción del número máximo de movimientos permitidos
    sum(i in 1..numOpiniones)(estrategiaModeracion[i]) <= maxMovimientos;

% Cálculo del esfuerzo total de moderación
constraint
    esfuerzoTotal = sum(i in 1..numOpiniones)(
        distribucionOpiniones[i] * (estrategiaModeracion[i] * (1 - costosExtras[i]) * abs(valoresOpiniones[i]))
    );

% Cálculo del extremismo final
constraint
    extremismoFinal = 2 * sqrt(sum(i in 1..numOpiniones)(
        (estrategiaModeracion[i] == 0) * (distribucionOpiniones[i] * valoresOpiniones[i]^2)
    ) / numOpiniones);

% Función objetivo: minimizar el extremismo en la red
solve minimize extremismoFinal;

% Salida de resultados
output [
    "Extremismo Final: ", show(extremismoFinal), "\n",
    "Esfuerzo Total: ", show(esfuerzoTotal), "\n",
    "Estrategia de Moderación: ", show(estrategiaModeracion)
];
