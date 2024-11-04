%                             Datos de entrada                                              
int: n; % Número de personas
int: m; % Número de opiniones posibles que pueden tener las personas
array[1..m] of int: p; % Número de personas en cada opinión inicial
array[1..m] of float: v; % Valores de las opiniones
array[1..m] of float: ce; % Valores de los costos extras
array[1..m, 1..m] of float: c; % Costo del esfuerzo de mover una persona de opinión i a opinión j
float: ct; % Costo total máximo permitido
int: maxM; % Número máximo de movimientos permitidos


%                             Variables de Decisión                                            
array[1..m, 1..m] of var 0..n: x; % Número de personas que se mueven de opinión i a j


%                              Otras Variables                                                  
var float: costo = sum(i, j in 1..m)(c[i, j] * (1 + p[i] / n) * x[i, j] + (if p[j] = 0 then ce[j] else 0 endif)* ce[j] * x[i, j] );
var float: movimientosTotales =  sum(i,j in 1..m)(abs(j - i) * x[i,j]);
var float: personaOpinion =  sum(i,j in 1..m)(x[i,j]);
    
%                                           Restricciones

constraint costo <= ct; % Restricción de costo total permitido
constraint movimientosTotales <= maxM; % Restricción de número máximo de movimientos
constraint forall(i in 1..m)(sum(j in 1..m)(x[i, j]) <= p[i]); % No se pueden mover más personas de las que originalmente están en cada opinión
constraint forall(i in 1..m)(x[i,i] = 0); %no se permiten mover personas dentro de la misma opinion
constraint personaOpinion <= n;

%                                         Restricciones de no negatividad
constraint costo >= 0;
constraint movimientosTotales >= 0;


%                    Distribución de las personas, despues de los movimientos 
array[1..m] of var int: nueva_p = [ p[i] + sum(j in 1..m)(x[j, i]) - sum(j in 1..m)(x[i, j]) | i in 1..m]; 

%                    Función para calcular el punto medio
function float: calcular_punto_medio(int: total_personas) =
    if total_personas mod 2 = 1 then(total_personas + 1) / 2.0 
    else total_personas / 2.0 endif;


%                    Función para calcular la mediana ponderada ajustada
function float: calcular_mediana_ponderada(array[int] of int: p_actual, array[int] of float: v) =
    let {
        int: total_personas = sum(p_actual),
        float: punto_medio = calcular_punto_medio(total_personas),
        array[int] of float: acumulado = [sum(p_actual[1..i]) | i in index_set(p_actual)]
    } in
    v[arg_min([if acumulado[i] >= punto_medio then acumulado[i] else total_personas + 1 endif | i in index_set(p_actual)])];

%                       Calcular la mediana ponderada para la nueva distribución

var float: nueva_mediana_ponderada = calcular_mediana_ponderada(p, v);

%                     Función Objetivo: Minimizar la polarización total

var float: polarizacion = sum(i in 1..m)(nueva_p[i] * abs(v[i] - nueva_mediana_ponderada));
solve minimize polarizacion;

%                             Mostrar el resultado

output [
   %"La mediana ponderada final es: ", show(nueva_mediana_ponderada), "\n",
    "Distribución final de personas por opinión: ", show(nueva_p), "\n",
   % "Términos de la polarización: ", show(terminos_polarizacion), "\n",
    "Polarización total: ", show(polarizacion), "\n",
   % "Costo: ", show(costo), "\n",
     "movimientos Totales: ", show(movimientosTotales), "\n",
   % "personaOpinion: ", show(personaOpinion), "\n",
   % "x: ", show(x), "\n",
];