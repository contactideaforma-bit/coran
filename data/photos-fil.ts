/* Photos de fond du Scroll halal (Unsplash, licence Unsplash : usage libre,
 * affichage direct depuis images.unsplash.com, crédit de l'auteur affiché).
 *
 * Chaque photo est rattachée à une scène (son d'ambiance + dessin de secours).
 * Pour en ajouter : copier l'identifiant « photo-… » de l'URL Unsplash,
 * le nom de l'auteur et son pseudo.
 */

import type { SceneId } from "./fil";

export interface PhotoFil {
  id: string; // partie « photo-… » de l'URL images.unsplash.com
  scene: SceneId;
  auteur: string;
  pseudo: string; // pseudo Unsplash (lien de crédit)
}

export const PHOTOS_FIL: PhotoFil[] = [
  // Montagnes
  { id: "photo-1554629947-334ff61d85dc", scene: "montagnes", auteur: "Mads Schmidt Rasmussen", pseudo: "mvds" },
  { id: "photo-1540979388789-6cee28a1cdc9", scene: "montagnes", auteur: "Boris Baldinger", pseudo: "borisbaldinger" },
  { id: "photo-1542224566-6e85f2e6772f", scene: "montagnes", auteur: "Luke Richardson", pseudo: "lukealrich" },
  { id: "photo-1542662565-7e4b66bae529", scene: "montagnes", auteur: "J M", pseudo: "jmagpie" },
  { id: "photo-1594329852649-012d9528deda", scene: "montagnes", auteur: "Dave Hoefler", pseudo: "iamthedave" },
  // Aube / lumière dorée
  { id: "photo-1595495745827-85bcc5c9a028", scene: "aube", auteur: "Tomáš Malík", pseudo: "malcoo" },
  { id: "photo-1584551246679-0daf3d275d0f", scene: "aube", auteur: "Daniel Olah", pseudo: "danesduet" },
  { id: "photo-1567712595315-545da0d341b2", scene: "aube", auteur: "David Billings", pseudo: "dav_billings" },
  { id: "photo-1666692266862-d336f746d46d", scene: "aube", auteur: "Adrià Sánchez Roqué", pseudo: "asr_optical" },
  // Nuit étoilée
  { id: "photo-1628498188904-036f5e25e93e", scene: "nuit", auteur: "Olena Bohovyk", pseudo: "olenkasergienko" },
  { id: "photo-1628498188873-579210ce622e", scene: "nuit", auteur: "Olena Bohovyk", pseudo: "olenkasergienko" },
  { id: "photo-1622793139910-e261be0b30a4", scene: "nuit", auteur: "Melanie Weidmann", pseudo: "melanieweidmann_photography" },
  { id: "photo-1535418126925-0bfb3a0ee0d7", scene: "nuit", auteur: "neida zarate", pseudo: "neida" },
  { id: "photo-1599148400620-8e1ff0bf28d8", scene: "nuit", auteur: "Olena Bohovyk", pseudo: "olenkasergienko" },
  { id: "photo-1619665481428-101a5daa4d15", scene: "nuit", auteur: "eduardo rosal", pseudo: "eduardorosal" },
  { id: "photo-1537181534458-45dcee76ae90", scene: "nuit", auteur: "Izuddin Helmi Adnan", pseudo: "izuddinhelmi" },
  // Mer
  { id: "photo-1503891617560-5b8c2e28cbf6", scene: "mer", auteur: "Ian Keefe", pseudo: "iankeefe" },
  { id: "photo-1624120588976-00b576b59c48", scene: "mer", auteur: "Tusik Only", pseudo: "tusik" },
  { id: "photo-1649115881793-b6a6454c2cdb", scene: "mer", auteur: "Zeynep S.", pseudo: "ispywithmylittleeye" },
  { id: "photo-1593264615251-f581c6df1e5a", scene: "mer", auteur: "Arctic", pseudo: "ioarctic" },
  { id: "photo-1581176512694-c56c5c731041", scene: "mer", auteur: "Renato Trentin", pseudo: "renatotrentin" },
  // Forêt
  { id: "photo-1503435980610-a51f3ddfee50", scene: "foret", auteur: "Filip Zrnzević", pseudo: "filipz" },
  { id: "photo-1444724334165-e7050f2229a1", scene: "foret", auteur: "Staffan Kjellvestad", pseudo: "staffank" },
  { id: "photo-1603976328262-4c1b46d7e6e8", scene: "foret", auteur: "Michael Krahn", pseudo: "michael_g_krahn" },
  { id: "photo-1509316975850-ff9c5deb0cd9", scene: "foret", auteur: "Clément M.", pseudo: "cmreflections" },
  { id: "photo-1502580969434-4550a9e56735", scene: "foret", auteur: "Toby Wong", pseudo: "hitobywong" },
  { id: "photo-1567699631772-21be4f5ef2ce", scene: "foret", auteur: "Dave Hoefler", pseudo: "iamthedave" },
  // Désert et mosquées (scène désert)
  { id: "photo-1559767180-47d8f4919e5d", scene: "desert", auteur: "Matteo Di Iorio", pseudo: "shot_by_teo" },
  { id: "photo-1638732984528-f255c9714619", scene: "desert", auteur: "raouf bedrani", pseudo: "roofy_213" },
  { id: "photo-1579783616444-4604fd2fb8f0", scene: "desert", auteur: "Silas Baisch", pseudo: "silasbaisch" },
  { id: "photo-1650556443811-4f515ca1b1f9", scene: "desert", auteur: "Reed Naliboff", pseudo: "reednaliboff" },
  { id: "photo-1590273089302-ebbc53986b6e", scene: "desert", auteur: "Alessa Ciraulo", pseudo: "alessaxci" },
  { id: "photo-1590075865003-e48277faa558", scene: "desert", auteur: "Nick Fewings", pseudo: "jannerboy62" },
  { id: "photo-1554110838-816383ce7956", scene: "desert", auteur: "Mike Iukhtenko", pseudo: "yamaicle" },
];

/** URL d'affichage (recadrée au format portrait, poids léger). */
export function urlPhoto(p: PhotoFil, largeur = 720) {
  return `https://images.unsplash.com/${p.id}?auto=format&fit=crop&crop=entropy&w=${largeur}&h=${Math.round(largeur * 16 / 9)}&q=70`;
}
