document.addEventListener('DOMContentLoaded', () => {
    const exercisesList = document.getElementById('exercisesList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const entityFilter = document.getElementById('entityFilter');
    const expandAllBtn = document.getElementById('expandAllBtn');
    
    let allExpanded = false;

    // Populate categories
    const categories = [...new Set(exercisesData.map(ex => ex.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Populate entities
    const allEntities = [...new Set(exercisesData.flatMap(ex => ex.entities || []))].sort();
    allEntities.forEach(ent => {
        const option = document.createElement('option');
        option.value = ent;
        option.textContent = ent;
        entityFilter.appendChild(option);
    });

    expandAllBtn.addEventListener('click', () => {
        allExpanded = !allExpanded;
        expandAllBtn.textContent = allExpanded ? 'Contraer todo' : 'Expandir todo';
        
        const cards = exercisesList.querySelectorAll('.exercise-card');
        cards.forEach(card => {
            const toggleBtn = card.querySelector('.toggle-solution-btn');
            const solutionContent = card.querySelector('.solution-content');
            const isHidden = solutionContent.classList.contains('hidden');
            
            if (allExpanded && isHidden) {
                solutionContent.classList.remove('hidden');
                toggleBtn.querySelector('span').textContent = 'Ocultar Solución';
                toggleBtn.classList.add('active');
            } else if (!allExpanded && !isHidden) {
                solutionContent.classList.add('hidden');
                toggleBtn.querySelector('span').textContent = 'Ver Solución';
                toggleBtn.classList.remove('active');
            }
        });
    });

    function highlightSQL(sql) {
        let html = sql.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const regex = /(--[^\n]*)|('[^']*')|\b(ISNULL|SUM|COUNT|YEAR|MAX|MIN|AVG|CONVERT|MONTH|DATEPART|ABS|STR|SUBSTRING|DISTINCT)\b|\b(SELECT|FROM|WHERE|JOIN|ON|AND|OR|GROUP BY|ORDER BY|HAVING|DESC|ASC|AS|TOP|LEFT|RIGHT|INNER|OUTER|UNION|ALL|WITH|EXISTS|IN|NOT|CASE|WHEN|THEN|ELSE|END)\b/gi;
        
        html = html.replace(regex, function(match, p1, p2, p3, p4) {
            if (p1) return '<span class="sql-comment">' + p1 + '</span>';
            if (p2) return '<span class="sql-string">' + p2 + '</span>';
            if (p3) return '<span class="sql-function">' + p3 + '</span>';
            if (p4) return '<span class="sql-keyword">' + p4 + '</span>';
            return match;
        });
        return html;
    }

    function renderExercises(data) {
        exercisesList.innerHTML = '';
        if (data.length === 0) {
            exercisesList.innerHTML = '<p class="no-results">No se encontraron ejercicios que coincidan con la búsqueda.</p>';
            return;
        }

        data.forEach(ex => {
            const card = document.createElement('article');
            card.className = 'exercise-card';
            
            // Map category to CSS class
            let catClass = '';
            if (ex.category === 'SQL') catClass = 'cat-sql';
            else if (ex.category === 'T-SQL') catClass = 'cat-t-sql';
            else if (ex.category === 'Parcial') catClass = 'cat-parcial';

            // Generate entities HTML
            const entitiesHtml = (ex.entities && ex.entities.length > 0)
                ? `<div class="entity-tags">${ex.entities.map(e => `<span class="entity-tag">${e}</span>`).join('')}</div>`
                : '';

            card.innerHTML = `
                <div class="exercise-header">
                    <span class="category-badge ${catClass}">${ex.category}</span>
                    <h2 class="exercise-title">Ejercicio ${ex.id}</h2>
                </div>
                ${entitiesHtml}
                <p class="exercise-statement">${ex.statement}</p>
                
                <div class="solution-container">
                    <button class="toggle-solution-btn">
                        <span>Ver Solución</span>
                        <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div class="solution-content hidden">
                        <div class="code-wrapper">
                            <button class="copy-btn" title="Copiar código">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </button>
                            <pre><code class="language-sql">${highlightSQL(ex.solution)}</code></pre>
                        </div>
                    </div>
                </div>
            `;

            // Toggle solution
            const toggleBtn = card.querySelector('.toggle-solution-btn');
            const solutionContent = card.querySelector('.solution-content');
            toggleBtn.addEventListener('click', () => {
                const isHidden = solutionContent.classList.contains('hidden');
                if (isHidden) {
                    solutionContent.classList.remove('hidden');
                    toggleBtn.querySelector('span').textContent = 'Ocultar Solución';
                    toggleBtn.classList.add('active');
                } else {
                    solutionContent.classList.add('hidden');
                    toggleBtn.querySelector('span').textContent = 'Ver Solución';
                    toggleBtn.classList.remove('active');
                }
            });

            // Copy logic
            const copyBtn = card.querySelector('.copy-btn');
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(ex.solution).then(() => {
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                });
            });

            exercisesList.appendChild(card);
        });
    }

    function filterData() {
        const query = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const entity = entityFilter.value;

        const filtered = exercisesData.filter(ex => {
            const matchesSearch = ex.statement.toLowerCase().includes(query) || ex.solution.toLowerCase().includes(query);
            const matchesCategory = category === 'all' || ex.category === category;
            const matchesEntity = entity === 'all' || (ex.entities && ex.entities.includes(entity));
            return matchesSearch && matchesCategory && matchesEntity;
        });

        renderExercises(filtered);
    }

    searchInput.addEventListener('input', filterData);
    categoryFilter.addEventListener('change', filterData);
    entityFilter.addEventListener('change', filterData);

    // Initial render
    renderExercises(exercisesData);
});
