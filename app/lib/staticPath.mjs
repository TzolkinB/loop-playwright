import { join, normalize, sep } from 'node:path'

/**
 * Maps a request pathname to a file inside the build folder.
 *
 * This is the one place untrusted input reaches the filesystem, so it is a
 * pure function with no I/O: decode, normalise, and refuse anything that lands
 * outside the build folder.
 *
 * @param {string} distDir Absolute path of the build folder.
 * @param {string} pathname Request pathname, still percent-encoded.
 * @returns {{ file: string } | { status: 400 | 403 }} The file to serve, or the
 *   status to answer with: 400 for malformed encoding, 403 for an escape attempt.
 */
export function resolveStaticPath(distDir, pathname) {
  // End the root with a separator so a sibling folder that merely shares the
  // prefix (dist-evil next to dist) is not treated as inside the build folder.
  const root = distDir.endsWith(sep) ? distDir : distDir + sep

  let file
  try {
    file = normalize(join(root, decodeURIComponent(pathname)))
  } catch {
    return { status: 400 }
  }

  if (!file.startsWith(root)) return { status: 403 }

  return { file: pathname.endsWith('/') ? join(file, 'index.html') : file }
}
