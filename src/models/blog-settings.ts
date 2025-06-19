import mongoose, { Schema, Document } from 'mongoose';

export interface MenuItem {
  name: string;
  url: string;
  order: number;
  isCTA?: boolean;
}

export interface Menu {
  name: string;
  location: string; // 'header', 'footer', 'sidebar', etc.
  items: MenuItem[];
}

export interface IBlogSettings extends Document {
  name: string;
  description: string;
  logo: string;
  favicon: string;
  defaultAuthorName: string;
  defaultAuthorEmail: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  homePage: {
    type: string; // 'default', 'page', 'category', 'post'
    id: string; // ID do objeto selecionado (página, categoria ou post)
    slug: string; // Slug do objeto selecionado
    title: string; // Título do objeto selecionado
  };
  menus: Menu[];
  // Manter o campo antigo para compatibilidade com código existente
  legacyMenuItems: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSettingsSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, adicione um nome para o blog'],
      trim: true,
      maxlength: [100, 'O nome não pode ter mais de 100 caracteres'],
      default: 'Meu Blog'
    },
    homePage: {
      type: {
        type: String,
        enum: ['default', 'page', 'category', 'post'],
        default: 'default'
      },
      id: {
        type: String,
        default: ''
      },
      slug: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'A descrição não pode ter mais de 500 caracteres'],
      default: 'Um blog sobre diversos assuntos interessantes'
    },
    logo: {
      type: String,
      default: '/logo.png'
    },
    favicon: {
      type: String,
      default: '/favicon.ico'
    },
    defaultAuthorName: {
      type: String,
      default: 'Administrador'
    },
    defaultAuthorEmail: {
      type: String,
      default: 'admin@exemplo.com'
    },
    contactEmail: {
      type: String,
      default: 'contato@exemplo.com'
    },
    contactPhone: {
      type: String,
      default: ''
    },
    contactWhatsapp: {
      type: String,
      default: ''
    },
    address: {
      street: {
        type: String,
        default: ''
      },
      number: {
        type: String,
        default: ''
      },
      city: {
        type: String,
        default: ''
      },
      state: {
        type: String,
        default: ''
      },
      country: {
        type: String,
        default: ''
      },
      zipCode: {
        type: String,
        default: ''
      }
    },
    socialMedia: {
      facebook: {
        type: String,
        default: ''
      },
      twitter: {
        type: String,
        default: ''
      },
      instagram: {
        type: String,
        default: ''
      },
      linkedin: {
        type: String,
        default: ''
      },
      youtube: {
        type: String,
        default: ''
      }
    },
    menus: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        location: {
          type: String,
          required: true,
          enum: ['header', 'footer', 'sidebar', 'mobile'],
          default: 'header'
        },
        items: [
          {
            name: {
              type: String,
              required: true,
              trim: true
            },
            url: {
              type: String,
              required: true,
              trim: true
            },
            order: {
              type: Number,
              default: 0
            },
            isCTA: {
              type: Boolean,
              default: false
            }
          }
        ]
      }
    ],
    // Campo legado para compatibilidade com código existente
    legacyMenuItems: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        url: {
          type: String,
          required: true,
          trim: true
        },
        order: {
          type: Number,
          default: 0
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Garantir que apenas um documento de configurações exista
BlogSettingsSchema.statics.findOneOrCreate = async function() {
  const settings = await this.findOne();
  if (settings) {
    return settings;
  }
  
  return this.create({});
};

export default mongoose.models.BlogSettings || mongoose.model<IBlogSettings>('BlogSettings', BlogSettingsSchema);
