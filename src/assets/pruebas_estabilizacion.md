# Registro de Pruebas de Estabilización

Este documento registra los intentos realizados para encontrar los parámetros ideales que permitan estabilizar el sistema de la Hormiga de Langton, logrando un equilibrio entre la tasa de nacimientos y muertes.

## Historial de Experimentos

| Escenario | Densidad Inicial | Distribución Inicial<br>(Re, Tr, Rp, So) | Probabilidad de Nacimientos<br>(Re, Tr, Rp, So) | Generaciones | Nacimientos | Decesos | Ratio N/D | Conclusión |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1. Sobrepoblación** | 50% | 20%, 20%, 40%, 20% | 25%, 15%, 45%, 15% | 75 | 6,232 | 1,232 | 5.06 | Reacción en cadena exponencial. El tablero colapsó por falta de espacio en turnos tempranos debido a un exceso reproductivo. |
| **2. Aislamiento** | 10% | 5%, 45%, 10%, 40% | 1%, 60%, 4%, 35% | 156 | 62 | 1,062 | 0.06 | Aislamiento poblacional. Nacieron muy pocas crías nuevas, provocando que la colonia original envejeciera y muriera. |
| **3. Cercanía a la Estabilidad** | 25% | 12%, 30%, 28%, 30% | 15%, 35%, 20%, 30% | 761 | 16,151 | 18,651 | 0.87 | Excelente amortiguación. La colonia logró sostener la vida masiva por más de 700 turnos. A un paso de la estabilidad absoluta. |
| **4. Estabilidad Dinámica (Éxito)** | 25% | 12%, 30%, 28%, 30% | 16%, 30%, 24%, 30% | > 513 | 44,708 | 39,078 | 1.14 | ¡Objetivo logrado! El ecosistema encontró un equilibrio autosostenible de altísima densidad. La colonia puede vivir indefinidamente sin extinguirse. |

---

## Conclusión Final
El sistema es altamente sensible a la probabilidad de nacimiento de crías reproductivas (Reinas y Reproductoras). Manteniendo esta tasa alrededor del **40% combinada** con una densidad inicial moderada, se logra estabilizar la reacción en cadena, permitiendo que la colonia prospere en el tiempo formando un sistema vivo y caóticamente hermoso.
