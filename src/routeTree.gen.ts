/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as QuestionsImport } from './routes/questions'
import { Route as QuestionImport } from './routes/question'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const QuestionsRoute = QuestionsImport.update({
  id: '/questions',
  path: '/questions',
  getParentRoute: () => rootRoute,
} as any)

const QuestionRoute = QuestionImport.update({
  id: '/question',
  path: '/question',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/question': {
      id: '/question'
      path: '/question'
      fullPath: '/question'
      preLoaderRoute: typeof QuestionImport
      parentRoute: typeof rootRoute
    }
    '/questions': {
      id: '/questions'
      path: '/questions'
      fullPath: '/questions'
      preLoaderRoute: typeof QuestionsImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/question': typeof QuestionRoute
  '/questions': typeof QuestionsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/question': typeof QuestionRoute
  '/questions': typeof QuestionsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/question': typeof QuestionRoute
  '/questions': typeof QuestionsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/question' | '/questions'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/question' | '/questions'
  id: '__root__' | '/' | '/question' | '/questions'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  QuestionRoute: typeof QuestionRoute
  QuestionsRoute: typeof QuestionsRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  QuestionRoute: QuestionRoute,
  QuestionsRoute: QuestionsRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/question",
        "/questions"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/question": {
      "filePath": "question.tsx"
    },
    "/questions": {
      "filePath": "questions.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
