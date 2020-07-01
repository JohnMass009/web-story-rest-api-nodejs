const roles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Admin rights',
    resource: [
      {
        id: 'any',
        permissions: [ 'create', 'read', 'update', 'delete' ]
      },
      {
        id: 'profile',
        permissions: [ 'create', 'read', 'update', 'delete' ]
      },
      {
        id: 'documents',
        permissions: [ 'create', 'read', 'update', 'delete' ]
      },
      {
        id: 'writer',
        permissions: [ 'create', 'read', 'update', 'delete' ]
      },

    ]
  },
  {
    id: 'reader',
    name: 'Reader',
    description: 'Reader rights',
    resources: [
      {
        id: 'any',
        permissions: [ 'create', 'read', 'update', 'delete' ]
      },
      {
        id: 'profile',
        permissions: [ 'read', 'update' ]
      },
      {
        id: 'documents',
        permissions: [ ]
      },
      {
        id: 'writer',
        permissions: [ ]
      },
    ]
  },
  {
    id: 'writer',
    name: 'Writer',
    description: 'Writer rights',
    resource: [
      {
        id: 'any',
        permissions: [ 'create', 'read', 'update', 'delete' ]
      },
      {
        id: 'profile',
        permissions: [ 'read', 'update' ]
      },
      {
        id: 'documents',
        permissions: [ 'create', 'read', 'update', 'delete' ]
      },
      {
        id: 'writer',
        permissions: [ 'create', 'read', 'update', 'delete' ]
      },
    ]
  }
];

module.exports = roles;