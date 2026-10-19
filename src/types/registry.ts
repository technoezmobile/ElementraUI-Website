export interface ComponentFile {
  name: string
  content: string
  language?: string
}

export interface RegistryComponent {
  id: string
  name: string
  slug: string
  category: "3D" | "Shaders" | "Heroes" | "Typography" | "Galleries" | "Navigation" | "Effects"
  author: {
    name: string
    url?: string
    avatar?: string
  }
  description: string
  tags: string[]
  license: string
  dependencies: string[]
  registryDependencies?: string[]
  provenance: {
    origin: string
    repository: string
    licenseUrl: string
  }
  installCommand: string
  componentCode: string
  demoCode: string
}
