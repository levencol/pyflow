import os

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_layout = """    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <ToastContainer />

      {/* Top Header with Hamburger Menu */}
      <header className="h-16 apple-glass dark:apple-glass-dark px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Ouvrir le menu"
          >
            <Menu className="h-5.5 w-5.5 text-slate-700 dark:text-slate-300" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold tracking-tight shadow-md select-none font-display text-sm">
              Py
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-black text-slate-900 dark:text-white text-sm tracking-tight leading-tight">PyFlow</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {studentName && (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-3 py-1.5 rounded-full">
                <User className="h-3.5 w-3.5 text-indigo-500" />
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 max-w-28 truncate">{studentName}</span>
              </div>
              <button
                onClick={handleStudentLogout}
                title="Se déconnecter"
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* DROPDOWN MENU / OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-64 h-full shadow-2xl flex flex-col border-r border-slate-200 dark:border-slate-800 animate-slide-in-left">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold font-display text-slate-800 dark:text-slate-200">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {[
                { id: 'accueil', label: 'Accueil', icon: Sparkles },
                { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
                { id: 'profil', label: 'Profil', icon: User },
                { id: 'document', label: 'Document', icon: BookOpen },
                { id: 'certificats', label: 'Certificats', icon: Award },
                { id: 'badges', label: 'Badges', icon: Shield },
                { id: 'exercices', label: 'Exercices', icon: Code },
                { id: 'pratique', label: 'Pratique', icon: CheckSquare },
                { id: 'entrainement', label: 'Entrainement', icon: Flame },
                { id: 'projets', label: 'Projets', icon: Trophy }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeTab === item.id
                      ? 'apple-btn-primary shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              {isAdminAuthenticated && (
                <>
                  <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>
                  <button
                    onClick={() => { setActiveTab('admin'); setIsMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      activeTab === 'admin'
                        ? 'apple-btn-primary shadow-xs'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Shield className="h-4.5 w-4.5 text-indigo-400" />
                    <span>Administration</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* SCREEN SCROLLABLE CONTENT BODY */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
        {activeTab === 'accueil' && <PlaceholderView title="Accueil" icon={<Sparkles className="h-6 w-6" />} description="Bienvenue sur la page d'accueil de la formation." />}
        {activeTab === 'profil' && <PlaceholderView title="Mon Profil" icon={<User className="h-6 w-6" />} description="Gérez vos informations personnelles et préférences." />}
        {activeTab === 'document' && <PlaceholderView title="Documents" icon={<BookOpen className="h-6 w-6" />} description="Retrouvez ici tous les supports de cours et documents de référence." />}
        {activeTab === 'certificats' && <PlaceholderView title="Certificats" icon={<Award className="h-6 w-6" />} description="Vos certificats de réussite seront disponibles ici." />}
        {activeTab === 'badges' && <PlaceholderView title="Badges" icon={<Shield className="h-6 w-6" />} description="Collectionnez des badges en complétant des défis." />}
        {activeTab === 'pratique' && <PlaceholderView title="Pratique" icon={<CheckSquare className="h-6 w-6" />} description="Zone de pratique libre pour tester vos compétences." />}
        {activeTab === 'entrainement' && <PlaceholderView title="Entrainement" icon={<Flame className="h-6 w-6" />} description="Exercices rapides pour maintenir votre niveau." />}
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            progress={progress}
            onSelectDay={handleSelectDay}
            onNavigateTab={setActiveTab as any}
            onSelectProject={handleSelectProject}
            unlockedDays={unlockedDays}
            unlockedProjects={unlockedProjects}
          />
        )}

        {activeTab === 'exercices' && (
          <ExerciseView
            dayId={selectedDayId}
            progress={progress}
            onPassQuiz={handlePassQuiz}
            onPassChallenge={handlePassChallenge}
            onSelectDay={setSelectedDayId}
            unlockedDays={unlockedDays}
          />
        )}

        {activeTab === 'projets' && (
          <ProjectView
            progress={progress}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onCompleteProject={handleCompleteProject}
            unlockedProjects={unlockedProjects}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            unlockedDays={unlockedDays}
            unlockedProjects={unlockedProjects}
            onUpdateUnlockedDays={handleUpdateUnlockedDays}
            onUpdateUnlockedProjects={handleUpdateUnlockedProjects}
            isAdminAuthenticated={isAdminAuthenticated}
            setIsAdminAuthenticated={setIsAdminAuthenticated}
          />
        )}
      </main>"""

start_str = '    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300">'
end_str = '</main>'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    end_idx += len(end_str)
    content = content[:start_idx] + new_layout + content[end_idx:]
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
