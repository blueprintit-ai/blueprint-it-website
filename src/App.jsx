          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1: IT Consulting */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Workstation Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Critical file backups for CNC applications, customer files, and manufacturing settings. Hot-swappable workstation 
                  configurations to minimize downtime. We understand that when your machines stop, your business stops - our solutions keep you running.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Service 2: Discovery Calls */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Technology Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Comprehensive evaluation of your shop technology infrastructure, connectivity, and backup systems. 
                  We assess your current vulnerabilities and provide solutions to protect your critical data.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Service 3: AI Automation */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">AI Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Streamline your production workflows with intelligent automation. From AI powered customer response to inventory management, 
                  we develop custom solutions that integrate with your existing processes and systems.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Service 4: Website Development */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Website Development</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Professional websites designed specifically for wood manufacturers. From project galleries to lead capture forms, 
                  we build modern, mobile-responsive sites that showcase your craftsmanship and convert visitors into customers.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
