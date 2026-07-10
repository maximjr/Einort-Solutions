import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/layout/Navbar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace "Command Center"
content = content.replace(
  'Command Center\n                  </p>',
  '{t("command_center")}\n                  </p>'
);

// Replace "Dashboard"
content = content.replace(
  'Dashboard\n                      </span>\n                    </div>\n                    <ChevronRight',
  '{t("dashboard")}\n                      </span>\n                    </div>\n                    <ChevronRight'
);

// Replace "Projects"
content = content.replace(
  'Projects\n                      </span>\n                    </button>',
  '{t("projects")}\n                      </span>\n                    </button>'
);

// Replace "Messages"
content = content.replace(
  'Messages\n                      </span>\n                      {/* Example badge */}',
  '{t("messages")}\n                      </span>\n                      {/* Example badge */}'
);

// Replace "Navigation"
content = content.replace(
  'Navigation\n              </p>\n              <div className="bg-white/[0.02]',
  '{t("navigation")}\n              </p>\n              <div className="bg-white/[0.02]'
);

// Replace {link.name} with {t(link.name.toLowerCase().replace(" ", "_"))}
content = content.replace(
  '<span className="font-medium text-white text-[15px] tracking-wide">\n                      {link.name}\n                    </span>',
  '<span className="font-medium text-white text-[15px] tracking-wide">\n                      {t(link.name.toLowerCase().replace(" ", "_"))}\n                    </span>'
);

// Replace "Professional\n                  Support"
content = content.replace(
  '<LifeBuoy size={16} className="text-slate-400" /> Professional\n                  Support',
  '<LifeBuoy size={16} className="text-slate-400" /> {t("professional_support")}'
);

// Replace "Sign Out"
content = content.replace(
  '<LogOut size={14} />\n                  Sign Out\n                </button>',
  '<LogOut size={14} />\n                  {t("sign_out")}\n                </button>'
);

fs.writeFileSync(filePath, content);
