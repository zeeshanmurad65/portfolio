(function(){

  var skills = [
    ['Python', 'language', 0.95],
    ['Machine Learning', 'domain', 0.9],
    ['Deep Learning', 'domain', 0.8],
    ['SQL / MySQL', 'data', 0.85],
    ['OpenCV', 'tool', 0.75],
    ['Streamlit', 'deployment', 0.85],
    ['FastAPI', 'deployment', 0.7],
    ['Docker', 'deployment', 0.6]
  ];
  var skillsGrid = document.getElementById('skills-grid');
  skills.forEach(function(s){
    var div = document.createElement('div');
    div.className = 'skill-card';
    div.innerHTML =
      '<div class="top"><span class="name">'+s[0]+'</span><span class="cat">'+s[1]+'</span></div>'+
      '<div class="bar-track"><div class="bar-fill" style="width:'+(s[2]*100)+'%"></div></div>';
    skillsGrid.appendChild(div);
  });

  var certs = [
    ['2026', 'IBM Data Science Professional Certificate', 'IBM'],
    ['2026', 'Data Science & Analytics Internship', 'DevelopersHub Corporation — Apr–May 2026'],
    ['—', 'NLP Specialization', 'Coursera'],
    ['—', 'Mathematics for Machine Learning: Linear Algebra', 'Coursera']
  ];
  var certList = document.getElementById('cert-list');
  certs.forEach(function(c){
    var div = document.createElement('div');
    div.className = 'cert-item';
    div.innerHTML =
      '<div class="date mono">'+c[0]+'</div>'+
      '<div><div class="title">'+c[1]+'</div><div class="issuer">'+c[2]+'</div></div>';
    certList.appendChild(div);
  });

  // ============================================================
  // PROJECTS — pulled from GitHub, but only the repos listed below
  // are shown. To add a project: push it to GitHub, then add it
  // to this list, either as:
  //   'exact-repo-name'                         (uses repo name as title)
  //   { repo: 'exact-repo-name', title: 'Nicer Display Title' }  (custom title)
  // To remove one from the site: delete its entry here — the repo
  // itself stays on GitHub untouched. Order here is the order they
  // appear on the site.
  // ============================================================
  var GITHUB_USER = 'zeeshanmurad65';
  var FEATURED_REPOS = [
    { repo: 'customer-churn-pipeline', title: 'Customer Churn Prediction Pipeline' },
    { repo: 'Machine-Failure-Prediction', title: 'Machine Failure Prediction System' },
    { repo: 'Emotion_detection_app', title: 'Emotion Detection App' },
    { repo: 'Electric-Vehicle', title: 'EV Resale Value Predictor' },
    { repo: 'House-Predication-Model', title: 'House Price Predictor' },
    { repo: 'Spam-Detection-Project', title: 'Spam Detection System' },
    { repo: 'Movie-Recommendation-System', title: 'Movie Recommendation System' },
    { repo: 'Titanic-survival-predictor', title: 'Titanic Survival Predictor' },
  ];

  var projectsGrid = document.getElementById('projects-grid');

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function titleCase(name){
    return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
  }

  function renderProjects(list){
    projectsGrid.innerHTML = '';
    if(!list.length){
      projectsGrid.innerHTML = '<div class="loading-cell">no public repos found yet — push one to GitHub and refresh.</div>';
      return;
    }
    list.forEach(function(p, i){
      var card = document.createElement('div');
      card.className = 'project-card';
      var idx = String(i).padStart(2,'0');
      var stackHtml = (p.stack||[]).map(function(t){ return '<span class="stack-tag">'+escapeHtml(t)+'</span>'; }).join('');
      var linkHtml = '<a class="project-link" href="'+escapeHtml(p.link)+'" target="_blank" rel="noopener">View →</a>';
      card.innerHTML =
        '<span class="project-idx">'+idx+'</span>'+
        '<div class="project-title">'+escapeHtml(p.title)+'</div>'+
        '<div class="project-desc">'+escapeHtml(p.desc)+'</div>'+
        '<div class="project-stack">'+stackHtml+'</div>'+
        '<div class="project-foot">'+linkHtml+'</div>';
      projectsGrid.appendChild(card);
    });
  }

  function renderError(){
    projectsGrid.innerHTML =
      '<div class="loading-cell">couldn\'t load projects from GitHub right now — '+
      '<a class="project-link" href="https://github.com/'+GITHUB_USER+'" target="_blank" rel="noopener">view them directly on GitHub →</a></div>';
  }

  async function loadProjectsFromGitHub(){
    if(!FEATURED_REPOS.length){
      projectsGrid.innerHTML = '<div class="loading-cell">no projects selected yet — add repo names to FEATURED_REPOS in script.js.</div>';
      return;
    }
    try{
      var res = await fetch('https://api.github.com/users/'+GITHUB_USER+'/repos?per_page=100');
      if(!res.ok) throw new Error('GitHub API error ' + res.status);
      var repos = await res.json();
      var byName = {};
      repos.forEach(function(r){ byName[r.name] = r; });

      var list = FEATURED_REPOS
        .map(function(entry){
          var isObj = typeof entry === 'object';
          var repoName = isObj ? entry.repo : entry;
          var repo = byName[repoName];
          if(!repo) return null;
          var stack = (repo.topics && repo.topics.length) ? repo.topics : (repo.language ? [repo.language] : []);
          return {
            title: (isObj && entry.title) ? entry.title : titleCase(repo.name),
            desc: repo.description || 'No description yet — add one in the repo settings on GitHub.',
            stack: stack,
            link: repo.html_url
          };
        })
        .filter(Boolean);

      renderProjects(list);
    }catch(err){
      renderError();
    }
  }

  loadProjectsFromGitHub();

})();
