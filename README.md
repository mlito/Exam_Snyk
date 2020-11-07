# Exam_Snyk
It assumed that nodejs installed on the PC where running  
Manual :   
1.In cmd line Go local folder of the project   
2.Run npm install command  
3.Run npm start command  
4.On browser go to localhost:3000   
5.In the textbox type the name of the package (for example "express" or "accepts") to check and press "Get Dependencies" button  

Tested scenarios: 
1) User tried to check non-existing package. 
2) Querying wrong repository URL ( inspite of that current implementation checks only repository https://registry.npmjs.org) 
3) Querying existiong package and that non-existing 

Limitations : 
1. All packages checked on repository https://registry.npmjs.org
2. There is no check for package version in current implementation - always querying for latest 
3. There is no caching implemented
4. For each pacakge scanned only 'dependencies' and NOT 'dev-dependencies'


  
