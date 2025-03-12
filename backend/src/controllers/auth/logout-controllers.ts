import { Request, Response } from 'express';

export const logout = (req: Request, res: Response) => {
  // Distrugge la sessione
  req.session.destroy((err) => {
    if (err) {
      console.error('Errore durante il logout:', err);
      return res.status(500).json({ message: 'Errore durante il logout' });
    }

    // Cancella il cookie della sessione
    res.clearCookie('connect.sid'); // 'connect.sid' è il nome predefinito del cookie di sessione
    res.status(200).json({ message: 'Logout effettuato con successo' });
  });
};