export const NUMBER_OF_PROJECTS_AND_TASKS_BY_ORGANIZATION_QUERY = `
    SELECT org.name AS "Organization name", COUNT(distinct proj.id) AS "Projects count", COUNT(tsk.id) AS "Tasks count"
        FROM organizations AS org
            JOIN projects AS proj ON proj."orgId" = org.id
                LEFT JOIN tasks AS tsk on tsk."projectId" = proj.id 
        GROUP BY org.name;`;

export const NUMBER_OF_TASKS_BY_ORGANIZATION_AND_PROJECT_QUERY = `
    SELECT org.name AS "Organization name", proj.name AS "Project name", count(tsk.id) as "Tasks count"
        FROM organizations AS org
            JOIN projects AS proj ON proj."orgId" = org.id
                LEFT JOIN tasks AS tsk ON tsk."projectId" = proj.id 
        GROUP BY org.name, proj.name;`;

export const NUMBER_OF_TASKS_AND_PROJECTS_AND_ORGANIZATIONS_QUERY = `
    SELECT COUNT(distinct org.id) AS "Organizations count", COUNT(distinct proj.id) AS "Projects count", COUNT(tsk.id) AS "Tasks count"
    FROM organizations AS org
        JOIN projects AS proj ON proj."orgId" = org.id
            LEFT JOIN tasks AS tsk on tsk."projectId" = proj.id`;
